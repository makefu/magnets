/* magnet.js a node.js crawler for funny pictures */

var http = require('http'),
fs = require('fs'),
sys = require('sys'),
url = require('url'),
crypto = require('crypto'),
logging = require('./streamlogger');
log = new logging.StreamLogger('./log/magnets.log');
log.level = log.levels.debug;

/* module exports */
exports.log = log;
exports.saveImage = saveImage;
exports.httpGet = httpGet;
exports.downloadImages = downloadImages;
exports.Image = Image


function Image(imageUrl) {
    this.url = imageUrl;
    this.fileName = imageUrl.split('/').pop();
    this.data = "";
    this.hash = "";
    this.toString = function () { 
        return  "url: " + this.url + 
                " filename: " + this.fileName + 
                " hash: "+ this.hash; 
    } 
}

function httpGet(image, callback, encoding) {
  log.debug('parsing url: ' + image.url);
  var parsedUrl = url.parse(image.url);
  var connection = http.createClient(80, parsedUrl.host);
  var getPath = parsedUrl.pathname;
  log.debug('connecting to ' + image.url)
  var request = connection.request('GET', getPath,  
    {"host": parsedUrl.host,"User-Agent": "fucking magnets"});

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
    var img = new Image(imageUrl);
    fs.readFile("./images/" + img.fileName, function(err,data) { 
      if ( err ) {
        httpGet(img, saveImage, "binary");
      } else {
        log.debug("File already exists: " + img)
      }
    });
  });
}

function saveImage(image) {
  image.hash = crypto.createHash('md5').update(image).digest("hex");
  //log.debug('writing file:' + image.fileName + ' with hash :' + image.hash + " loaded from : 
  log.debug('writing file: ' + image.toString() )
  fs.writeFile("./images/" + image.fileName, image.data,"binary", function (err) {
    if (err) throw err;
    log.info(image.fileName + ' saved!');
    log.debug(" * " + image);
  });
}


