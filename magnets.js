/* magnet.js a node.js crawler for funny pictures */

var http = require('http'),
fs = require('fs'),
sys = require('sys'),
url = require('url'),
crypto = require('crypto');

function Image(imageUrl) {
  return {
    url : imageUrl,
    fileName : imageUrl.split('/').pop(),
    data : "",
    hash : ""
  };
}

function httpGet(image, callback, encoding) {
  var parsedUrl = url.parse(image.url);
  var connection = http.createClient(80, parsedUrl.host);
  var getPath = parsedUrl.pathname;
  sys.puts('connecting to'+image.url)
  var request = connection.request('GET', getPath,  {"host": parsedUrl.host,"User-Agent": "fucking magnets"});

  request.addListener("response", function(response) {
    response.setEncoding(encoding);
    response.addListener("data", function(chunk) { 
      image.data += chunk
    });
    response.addListener("end", function() {
      callback(image)
    });
  });
  request.end();
}

function downloadImages(imageUrls) {
  imageUrls.forEach(function(imageUrl) {
    httpGet(new Image(imageUrl), saveImage, "binary");
  });
}

function saveImage(image) {
  // do not know yet what to use it for, but time will come...
  image.hash = crypto.createHash('md5').update(image).digest("hex");
  fs.writeFile("./images/" + image.fileName, image.data,"binary", function (err) {
    if (err) throw err;
    sys.puts(image.fileName+' saved!');
  });
}


exports.saveImage = saveImage;
exports.httpGet = httpGet;
exports.downloadImages = downloadImages;
exports.Image = Image
