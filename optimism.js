'use strict';

var optimism = require('optimist').usage("Usage: $0 [options...] <url>");

var METHODS = ['PUT', 'GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS', 'TRACE'];

function validHttpMethod(method) {
  return METHODS.indexOf(method) >= 0;
}

optimism.options('i', {
  type        : 'boolean',
  alias       : 'include',
  description : "Include protocol headers in the output"
});

optimism.options('X', {
  type        : 'string',
  alias       : 'request',
  default     : 'GET',
  description : "Specify request command to use"
}).check(function (argv) {
  return validHttpMethod(argv.X);
});

optimism.options('d', {
  type        : 'string',
  alias       : 'data',
  description : "HTTP POST data"
});

optimism.options('data-ascii', {
  type        : 'string',
  description : "HTTP POST ASCII data"
});

optimism.options('data-binary', {
  type        : 'string',
  description : "HTTP POST binary data"
});

optimism.check(function (argv) {
  return argv._.length === 1;
});

module.exports = optimism;
