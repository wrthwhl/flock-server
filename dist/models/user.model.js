'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _data = require('../data');

exports.default = {
  getAll: () => Object.values(_data.users)
};