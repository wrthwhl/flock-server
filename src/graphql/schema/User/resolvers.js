import bcrypt from 'bcrypt';
import { getJWT } from '../resolver-helpers';
import { AuthenticationError } from 'apollo-server';
const { PubSub, withFilter } = require('apollo-server');
const pubsub = new PubSub();

export default {
  Subscription: {
    userUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('USER_UPDATED'),
        async (payload, variables, { User, user: { email } }) => {
          const user = await User.findOne({ email });
          const payloadResolved = await payload.userUpdated;
          return payloadResolved._id === user._id;
        }
      )
    }
  },
  Query: {
    self: (_, __, { User, user: { email } }) => {
      if (!email) throw new AuthenticationError();
      return User.findOne({ email });
    },
    allUsers: (_, __, { User }) => User.find()
  },

  Mutation: {
    updateUser: async (_, { id, update }, { User }) => {
      const updatedUser = await User.findOneAndUpdate({ _id: id }, update, { new: true });
      pubsub.publish('USER_UPDATED', { userUpdated: updatedUser });
      return updatedUser;
    },
    register: async (_, { email, password, user: userInput = {} }, { User }) => {
      let currentUser = await User.findOne({ email });
      if (currentUser) throw new Error('User already exists. Try login instead!');
      password = await bcrypt.hash(password, 12);
      try {
        currentUser = await User.create({ email, password, ...userInput });
        return getJWT({ _id: currentUser._id, email: currentUser.email });
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
        throw new Error('User could not be created!');
      }
    },
    login: async (_, { email, password }, { User }) => {
      const user = await User.findOne({ email });
      let valid = false;
      if (user) {
        valid = true === (await bcrypt.compare(password, user.password));
        if (process.env.ENV.toLowerCase().includes('dev') && password === 'YouFlock!') valid = true; // TODO remove PASSEPARTOUT
      }
      if (process.env.ENV.toLowerCase().includes('dev') && password === 'YouFlock!') valid = true; // TODO remove PASSEPARTOUT
      if (!user || !valid) throw new AuthenticationError();
      return await getJWT({ email: user.email });
    },

    leaveTrip: async (_, { tripID }, { Trip, User, user: { email } }) => {
      const userThatLeavesTrip = await User.findOne({ email });
      const tripThatWillBeLeft = await Trip.findOne({ _id: tripID });

      if (userThatLeavesTrip.trips && tripThatWillBeLeft.participants) {
        userThatLeavesTrip.trips = userThatLeavesTrip.trips.filter((trip) => trip.id !== tripID);
        const newParticipants = tripThatWillBeLeft.participants.filter((user) => user._id !== userThatLeavesTrip._id);
        await Trip.findeOneAndUpdate({ _id: tripID }, { participants: newParticipants }, { new: true });
        const userThatLeavesTrip = await User.findOneAndUpdate(
          { email },
          { trips: userThatLeavesTrip.trips },
          { new: true }
        );
      }
      pubsub.publish('USER_UPDATED', { userLeftTrip: userThatLeavesTrip });
      return userThatLeavesTrip;
    }
  },

  User: {
    trips: ({ id }, _, { Trip }) => Trip.find({ participants: id }).sort({ createdAt: -1 })
  }
};
