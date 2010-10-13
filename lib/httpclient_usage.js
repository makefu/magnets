/*!
 * prototype  of API usage
 */

var HttpClient = require('./httpclient'),
Sys = require('sys');

var log = new require('./logger').Logger({
    logfile: "/tmp/asdf.log",
    loglevel: "debug",
    logstdout: true,
    color: true
  });

// Create client with logger and standard http headers
var client = HttpClient.createClient({
    logger: log,
    headers: {
      'User-Agent': 'foooobart'
    }
  });

// Create a request with custom encoding and add listener
var request = client.get('http://blog.roothausen.de/', {
    encoding: 'utf8'
  });

request.addListener('redirect', function () {
    makeSomeThing();
  }).addListener('complete', function (data) {
      Sys.puts(data); 
    }).addListener('error', function (data, response) {
        Sys.puts("ERROR!"); 
      })
    .send();
