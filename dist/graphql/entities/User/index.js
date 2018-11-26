'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.resolvers = exports.typeDefs = undefined;

var _resolvers = require('./resolvers.user');

var _resolvers2 = _interopRequireDefault(_resolvers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var typeDefs = 'extend type Query {\n  User(id: ID!): User!\n  allUsers: [User!]!\n}\n\nextend type Mutation {\n  updateUser(input: updateUserInput!): updatedUser!\n}\n\ntype User {\n  id: ID!\n  name: String\n  email: String\n  firstName: String\n  lastName: String\n}\n\ninput updateUserInput {\n  id: ID!\n  name: String\n}\n\ntype updatedUser {\n  id: ID!\n  name: String\n}\n';
exports.typeDefs = typeDefs;
exports.resolvers = _resolvers2.default;