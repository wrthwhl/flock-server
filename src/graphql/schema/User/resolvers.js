import bcrypt from 'bcrypt';
import { AuthenticationError } from 'apollo-server';
import { PubSub, withFilter } from 'apollo-server';
import fetch from 'node-fetch';
import { getJWT } from '../resolver-helpers';
import config from '../../../../config';
const pubsub = new PubSub();

export default {
  Subscription: {
    userUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('USER_UPDATED'),
        (payload, variables) => {
          return payload.userUpdated.email === variables.filteredEmail;
        }
      )
    }
  },
  Query: {
    self: (_, __, { User, user: { email } }) => User.findOne({ email }),
    allUsers: (_, __, { User }) => User.find()
  },

  Mutation: {
    updateUser: async (_, { id, update }, { User }) => {
      const updatedUser = await User.findOneAndUpdate({ _id: id }, update);
      pubsub.publish('USER_UPDATED', { userUpdated: updatedUser });
      return updatedUser;
    },
    register: async (_, { email, password, user = {} }, { User }) => {
      password = await bcrypt.hash(password, 12);
      try {
        const currentUser = await User.findOneAndUpdate(
          { email },
          { email, password, ...user },
          { upsert: true, new: true }
        );
        return getJWT({ _id: currentUser._id, email: currentUser.email });
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
        throw new Error('User could not be created!');
      }
    },
    facebook: async (_, { email, accessToken, userID, user = {} }, { User }) => {
      const uri = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${config.facebook
        .serverAccessToken}`;
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
      let valid = false;
      if (user) {
        valid = true === (await bcrypt.compare(password, user.password));
      }
      if (process.env.ENV.toLowerCase().includes('dev') && password === 'YouFlock!') valid = true; // TODO remove PASSEPARTOUT
      if (!user || !valid) throw new AuthenticationError();
      return await getJWT({ _id: user._id, email: user.email });
    }
  },

  User: {
    trips: ({ id }, _, { Trip }) => Trip.find({ participants: id })
  }
};
