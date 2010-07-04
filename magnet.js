/* magnet.js a node.js crawler for funny pictures */

var http = require('http'),
fs = require('fs'),
sys = require('sys'),
url = require('url');


function getImages(content) {
  var scriptFilter = /<script.*>.*<\/script>/
  var imageFilter = /<img .* src=['"]{1}([\S]*)['"]{1}\s?(.*)?\/>/g;
  var images = new Array();

  content = content.replace(scriptFilter, "");

  var match;
  while (match = imageFilter.exec(content)) {
      if(match != null && match != undefined) {
      images.push(match[1]);
    }
  }
  return images;
}


function httpGet(myUrl, callback, encoding) {
  var parsedUrl = url.parse(myUrl)
  var connection = http.createClient(80, parsedUrl.host);
  var getPath = parsedUrl.pathname
  var request = connection.request('GET', getPath,  {"host": parsedUrl.host,"User-Agent": "magnets.js"});

  request.addListener("response", function(response) {
    var responseBody = ""
    response.setEncoding(encoding);
    response.addListener("data", function(chunk) { 
      responseBody += chunk
    });
    response.addListener("end", function() {
      callback(responseBody)
    });
  });
  request.end();
}


function downloadImages(images) {
  images.forEach(function(image) {
    httpGet(image, saveImage, "binary");
  });
}

function saveImage(image) {
  fs.writeFile('test.jpg', image, function (err) {
    if (err) throw err;
    sys.puts('It\'s saved!');
  });
}

function crawlerfunct(content) {
  var images = getImages(content);
  downloadImages(images);
}

sys.puts("Start crawling");
var crawlUrl = "http://www.soup.io/everyone"
httpGet(crawlUrl,crawlerfunct, "utf8")
