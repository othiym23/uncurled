'use strict';

var request = require('request');
var codes   = require('http-status-codes');
var argv    = require('optimist')
  .boolean('i')
  .boolean('include')
  .argv;

function dumpHeaders(res) {
  console.log("HTTP/%s.%s %s %s",
              res.httpVersionMajor, res.httpVersionMinor,
              res.statusCode, codes.getStatusText(res.statusCode));
  Object.keys(res.headers).forEach(function (k) {
    console.log("%s: %s", k, res.headers[k]);
  });
}

request(argv._[0], function (error, res, body) {
  if (error) return console.error("uncurled barfed: %s", error.message);

  if (argv.i || argv.include) dumpHeaders(res);
  console.log();
  console.log(body);
});
