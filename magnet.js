/* magnet.js a node.js crawler for funny pictures */

var http = require('http'),
fs = require('fs'),
sys = require('sys'),
url = require('url'),
xml = require('./lib/node-xml');


function getImages(content, callback) {
  var parser = new xml.SaxParser(function(cb) {
    var images = new Array();

    cb.onStartDocument(function() { });

    cb.onEndDocument(function() {     
      callback(images);
    });

    cb.onStartElementNS(function(elem, attrs, prefix, uri, namespaces) {
      current_element = elem.toLowerCase();
      sys.puts(current_element)
      if(current_element == 'img') {
        sys.puts(attrs)
        //images.push(attrs["src"]) 
      }
    });

    cb.onEndElementNS(function(elem, prefix, uri) {
    });

    cb.onCharacters(function (chars) { });
    cb.onCdata(function(chars) { } );

    cb.onWarning(function(msg) {
      sys.puts('<WARNING>'+msg+"</WARNING>");
    });

    cb.onError(function(msg) {
      sys.puts('<ERROR>'+JSON.stringify(msg)+"</ERROR>");
    });

  });

  parser.parseString(content)
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
  getImages(content, function(images) {
    images.forEach(function(image) {
      sys.puts(image);
    }); 
  });
}

try {
  sys.puts("Start crawling");
  var crawlUrl = "http://www.soup.io/everyone"
  httpGet(crawlUrl,crawlerfunct)
  } catch(ex) {
    sys.puts("Error: " + puts);
  }
