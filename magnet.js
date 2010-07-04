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
  var request = connection.reques('GET', getPath,  {"host": parsedUrl.host,"User-Agent": "magnets.js"});

  request.addListener("response", function(response) {
    response.setEncoding("utf8");
    response.addListener("data", function(chunk) { response += chunk });
    response.addListener("end", function() {
      crawl(response)
    });
    request.end();
  });
}

function crawlerfunct(xml) {
  sys.puts(xml)
}

var crawlUrl = "http://www.soup.io/everyone"
httpGet(crawlUrl,crawlerfunct)
