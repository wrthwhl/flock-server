'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createServer;

var _apolloServer = require('apollo-server');

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createServer({ context } = {}) {
  return new _apolloServer.ApolloServer(_extends({}, _schema2.default, {
    // Context will be available to all resolvers
    context,
    // Style settings for the GraphQL Playground
    playground: {
      settings: _config2.default.PLAYGROUND_SETTINGS
    }
  }));
}