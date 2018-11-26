export default {
  Query    : {
    user     : (_, { id }, { User }) => User.findOne({ id: Number(id) }),
    allUsers : (_, __, { User }) => User.find()
  },

  Mutation : {
    updateUser : (_, { input: { id, ...update } }, { User }) => User.updateOne(id, update)
  },

  User     : {
    trips : ({ id }, _, { Trip }) => Trip.find({ participants: id })
  }
};
