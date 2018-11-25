'use strict';

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _index = require('./graphql/index');

var _index2 = _interopRequireDefault(_index);

var _models = require('./models');

var models = _interopRequireWildcard(_models);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Here, we are passing in our models as `context`.
// Why is this helpful?
// Using the models as context makes them automatically available
// to all resolvers. (passed to them as the 3rd argument)
// This way we have a neat separation between the `graphql`
// and the `models` code.
const server = (0, _index2.default)({ context: models });

// Now, run the server 🔥
server.listen({ port: _config2.default.PORT || 4000 }).then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`🎡   GraphQL Playground ready at ${url}`);
});