'use strict';

var request          = require('request');
var getStatusText    = require('http-status-codes').getStatusText;
var createReadStream = require('fs').createReadStream;
var URLEncodeStream  = require('urlencode-stream');
var optimism         = require('optimist')
  .usage("Usage: $0 [options...] <url>");

var METHODS = ['PUT', 'GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS', 'TRACE'];

function dumpHeaders(res) {
  console.log("HTTP/%s.%s %s %s",
              res.httpVersionMajor, res.httpVersionMinor,
              res.statusCode, getStatusText(res.statusCode));

  Object.keys(res.headers).forEach(function (k) {
    console.log("%s: %s", k, res.headers[k]);
  });
  console.log();
}

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

optimism.check(function (argv) {
  return argv._.length === 1;
});

var argv    = optimism.argv,
    url     = argv._[0],
    method  = argv.request,
    options = {url : url, method : method};

function handler(error, res, body) {
  if (error) return console.error("uncurled barfed: %s", error.message);

  if (argv.include) dumpHeaders(res);

  console.log(body);
}

function send(options, data, encoding) {
  options.method = 'POST';
  options.headers = {'Content-Type' : 'application/x-www-form-urlencoded'};

  if (encoding) options.encoding = encoding;

  var encoded;
  if (data[0] === '@') {
    var filename = data.slice(1);

    encoded = createReadStream(filename).pipe(new URLEncodeStream());
  }
  else if (data === '-') {
    encoded = process.stdin.pipe(new URLEncodeStream());
  }
  else {
    encoded = new URLEncodeStream();
    encoded.write(data);
    encoded.end();
  }

  return encoded.pipe(request(options, handler));
}

if (argv.data) {
  send(options, argv.data, 'ascii');
}
else {
  request(options, handler);
}
