/* magnet.js a node.js crawler for funny pictures */

var http = require('http'),
fs = require('fs'),
sys = require('sys'),
url = require('url'),
rss = require('./lib/node-xml');

function httpGet(myUrl,crawl) {
  var parsedUrl = url.parse(myUrl)
  var connection = http.createClient(80, parsedUrl.host);
  var getPath = parsedUrl.pathname
  var request = connection.request('GET', getPath,  {"host": parsedUrl.host,"User-Agent": "magnets.js"});

  request.addListener("response", function(response) {
    var responseBody = ""
    response.setEncoding("utf8");
    response.addListener("data", function(chunk) { 
      responseBody += chunk
    });
    response.addListener("end", function() {
      sys.puts("end!");
      crawl(responseBody)
    });
  });
  request.end();
}

function crawlerfunct(xml) {
  sys.puts(xml)
}

try {
  sys.puts("Start crawling");
  var crawlUrl = "http://www.soup.io/everyone"
  httpGet(crawlUrl,crawlerfunct)
} catch(ex) {
    sys.puts("Error: " + puts);
}
