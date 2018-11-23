// Every resolver is passed 4 arguments
// 1. Root object
// 2. Arguments passed (if any)
// 3. Context
//    In our case, the models we passed during server initialization
// 4. Info for advanced usage and optimization
//    The documentation helpfully suggests to read the source code:
//    https://github.com/graphql/graphql-js/blob/c82ff68f52722c20f10da69c9e50a030a1f218ae/src/type/definition.js#L489-L500

export default {
  Query    : {
    User     : (_, { id }, { User }) => User.getById(id),
    allUsers : (_, __, { User }) => User.getAll()
  },

  Mutation : {
    updateUser : (_, { input: { id, ...update } }, { User }) => User.updateOne(id, update)
  },

  // In the case of resolvers for custom types, the `root object`
  // mentioned above will be the `User`.
  // So, if we query the `books` of an User, we can conveniently
  // access all the Users properties.
  User     : {
    // trip : ({ id: UserId }, _, { Trip }) => Trip.getAll().filter((trip) => trip.User === UserId)
  }
};
