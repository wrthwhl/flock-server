import bcrypt from 'bcrypt';
import { AuthenticationError } from 'apollo-server';
import { PubSub, withFilter } from 'apollo-server';
import fetch from 'node-fetch';
import { getJWT } from '../resolver-helpers';
const pubsub = new PubSub();

export default {
  Subscription: {
    userUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('USER_UPDATED'),
        async (payload, _, { User, user: { email } }) => {
          const user = await User.findOne({ email });
          return payload._id === user._id.toString();
        }
      )
    }
  },
  Query: {
    self: (_, __, { User, user: { email } }) => {
      if (!email) throw new AuthenticationError();
      return User.findOne({ email });
    }
  },

  Mutation: {
    updateUser: async (_, { id, update }, { User }) => {
      const updatedUser = await User.findOneAndUpdate({ _id: id }, update, { new: true });
      pubsub.publish('USER_UPDATED', { userUpdated: updatedUser });
      return updatedUser;
    },
    register: async (_, { email, password, user: userInput = {} }, { User }) => {
      let currentUser = await User.findOne({ email });
      if (currentUser && currentUser.password) throw new Error('User already exists. Try login instead!');
      password = await bcrypt.hash(password, 12);
      try {
        currentUser = await User.findOneAndUpdate(
          { email },
          { email, password, ...userInput },
          { new: true, upsert: true }
        );
        return getJWT({ _id: currentUser._id, email: currentUser.email });
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
        throw new Error('User could not be created!');
      }
    },
    facebook: async (_, { email, accessToken, userID, user = {} }, { User }) => {
      // TODO consider caching facebook token
      console.log('process.env.FB_ServerAcessToken', process.env.FB_ServerAcessToken);
      const uri = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${process.env
        .FB_ServerAcessToken}`;
      const verification = await fetch(uri).then((res) => res.json());
      if (verification.data.is_valid && verification.data.user_id === userID) {
        try {
          const currentUser = await User.findOneAndUpdate({ email }, { email, ...user }, { upsert: true, new: true });
          return await getJWT({ _id: currentUser._id, email: currentUser.email });
        } catch (err) {
          console.error(err); // eslint-disable-line no-console
          throw new Error('User could not be created!');
        }
      } else {
        throw new AuthenticationError();
      }
    },
    login: async (_, { email, password }, { User }) => {
      const user = await User.findOne({ email });
      let valid = process.env.FLOCK_ENV === 'DEV' && password === 'YouFlock!' ? true : false; // TODO remove PASSEPARTOUT
      if (!user) throw new AuthenticationError('E-Mail and password combination seems to be invalid.');
      if (!user.password && !valid) throw new Error('User already exists. Please try login.');
      if (user && !valid && user.password) {
        valid = true === (await bcrypt.compare(password, user.password));
      }
      if (!valid || !user) throw new AuthenticationError();
      return await getJWT({ _id: user._id, email: user.email });
    }
  },

  User: {
    trips: ({ id }, _, { Trip }) => Trip.find({ participants: id }).sort({ createdAt: -1 })
  }
};
