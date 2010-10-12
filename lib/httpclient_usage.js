/*!
 * prototype  of API usage
 */

var HttpClient = require('httpclient');

var log = new require(logger).Logger({
  logfile: "./log/magnets.log",
  loglevel: "debug",
  logstdout: true,
  color: true
});

// Create client with logger and standard http headers
var client = HttpClient.createClient({
  logger: log,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'foooobart'
  }
});

// Create a request with custom encoding and add listener
var request = client.get('http://foo.bar/borg', {
  encoding: 'utf8',
  headers: {
    'Content-Type': 'fucking/miracles' 
  }
}).addListener('complete', function(data) {
  makeSomeThing(data);
});
