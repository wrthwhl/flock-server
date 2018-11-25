export default {
  Query    : {
    User     : (_, { id }, { User }) => User.getOne(id),
    allUsers : (_, __, { User }) => User.getAll()
  },

  Mutation : {
    updateUser : (_, { input: { id, ...update } }, { User }) => User.updateOne(id, update)
  },

  User     : {
    trips : ({ id }, _, { Trip }) => Trip.byUserID(id)
  }
};
