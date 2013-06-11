'use strict';

var request  = require('request');
var codes    = require('http-status-codes');
var optimism = require('optimist')
  .usage("Usage: $0 [options...] <url>")
  .boolean('i')
  .alias('i', 'include')
  .describe('i', "Include protocol headers in the output")
  .default('X', 'GET')
  .alias('X', 'request')
  .describe('X', 'Specify request command to use');
var argv     = optimism.argv;

function dumpHeaders(res) {
  console.log("HTTP/%s.%s %s %s",
              res.httpVersionMajor, res.httpVersionMinor,
              res.statusCode, codes.getStatusText(res.statusCode));

  Object.keys(res.headers).forEach(function (k) {
    console.log("%s: %s", k, res.headers[k]);
  });
  console.log();
}

function validHttpMethod(method) {
  return ['PUT', 'GET', 'POST',
          'DELETE', 'PATCH', 'OPTIONS',
          'TRACE', 'CONNECT'].indexOf(method) >= 0;
}

if (argv._.length !== 1 || !validHttpMethod(argv.X)) return optimism.showHelp();

var options = {
  url    : argv._[0],
  method : argv.request
};

request(options, function (error, res, body) {
  if (error) return console.error("uncurled barfed: %s", error.message);

  if (argv.i || argv.include) dumpHeaders(res);
  console.log(body);
});
