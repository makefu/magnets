/* magnet.js a node.js crawler for funny pictures */

var http = require('http'),
fs = require('fs'),
sys = require('sys'),
url = require('url');


function getImages(content) {
  var scriptFilter = /<script.*>.*<\/script>/
  var imageFilter = /<img .* src=['"]{1}([\S]*)['"]{1}\s?(.*)?\/>/g;


  content = content.replace(scriptFilter, "");
  
  var match;
  while (match = imageFilter.exec(content)) {
    if(match != null && match != undefined) {
      sys.puts(match[1])
    }
  }
}


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
      crawl(responseBody)
    });
  });
  request.end();
}

function crawlerfunct(content) {
  getImages(content);
}

try {
  sys.puts("Start crawling");
  var crawlUrl = "http://www.soup.io/everyone"
  httpGet(crawlUrl,crawlerfunct)
  } catch(ex) {
    sys.puts("Error: " + puts);
  }
