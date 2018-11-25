'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _resolvers = require('./resolvers');

var _resolvers2 = _interopRequireDefault(_resolvers);

var _User = require('../entities/User');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Root types
var rootTypeDefs = '# GraphQL doesn\'t allow for empty types (at least not yet!)\n# We can extend these empty `root` types in the other type definitions \uD83D\uDC4D\n# The root types might also be a good place for general queries / mutations\n# that are not associated with any specific entity\n\ntype Query {\n  _empty: String\n}\n\ntype Mutation {\n  _empty: String\n}\n';

// Entity types

exports.default = {
  // Apollo Server accepts an array of type definitions 👍
  typeDefs: [rootTypeDefs, _User.typeDefs],
  // Since the resolvers are just objects, we can make due with a deep merge
  resolvers: (0, _lodash2.default)(_resolvers2.default, _User.resolvers)
};