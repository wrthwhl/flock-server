const { PubSub, withFilter } = require('apollo-server');
const pubsub = new PubSub();

const USER_UPDATED = 'USER_UPDATED';

export default {
  Subscription: {
    userUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(USER_UPDATED),
        (payload, variables) => {
          return payload.userUpdated.email === variables.filteredEmail;
        }
      )
    }
  },

  Query: {
    user: (_, { id }, { User }) => User.findOne({ _id: id }),
    allUsers: (_, __, { User }) => User.find()
  },

  Mutation: {
    updateUser: async (_, { input: { ...update } }, { User }) => {
      const updatedUser = await User.findOneAndUpdate({ _id: update.id }, update, { new: true });
      pubsub.publish(USER_UPDATED, { userUpdated: updatedUser });
      console.log(updatedUser);
      return updatedUser;
    },
    createUser: (_, { input: { firstName, lastName, email, avatar_url } }, { User }) =>
      User.create({
        firstName,
        lastName,
        email,
        avatar_url
      })
  },

  User: {
    trips: ({ id }, _, { Trip }) => Trip.find({ participants: id })
  }

  // User : {
  //   trips : ({ id }, _, { Trip }) => Trip.find({ participants: id })
  // }
};
