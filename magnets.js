/* magnet.js a node.js crawler for funny pictures */

var http = require('http'),
fs = require('fs'),
sys = require('sys'),
url = require('url'),
crypto = require('crypto'),
logging = require('./lib/streamlogger');
log = new logging.StreamLogger('./log/magnets.log');
log.level = log.levels.debug;
function Image(imageUrl) {
    this.url = imageUrl;
    this.fileName = imageUrl.split('/').pop();
    this.fileType = '.'+this.fileName.split('.').pop();
    this.data = "";
    this.hash = "";
    this.toString = function () { 
        return  "url: " + this.url + 
                " filename: " + this.fileName + 
                " hash: "+ this.hash; 
    } 
}

function httpGet(image, callback, encoding) {
  log.debug('httpGet:' + image.url);
  var parsedUrl = url.parse(image.url);
  var connection = http.createClient(80, parsedUrl.host);
  var queryparms = parsedUrl.query ? '?' +parsedUrl.query :  '';
  var getPath = parsedUrl.pathname +  queryparms;
  var request = connection.request('GET', getPath  ,{"host": parsedUrl.host,"User-Agent": "fucking magnets"});

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
            httpGet(img, saveImage, "binary");
        });
}

function saveImage(image) {
  // do not know yet what to use it for, but time will come...
  image.hash = crypto.createHash('sha1').update(image.data).digest("hex");
  //log.debug('writing file:' + image.fileName + ' with hash :' + image.hash + " loaded from : 
  var fname = "./images/" + image.hash + image.fileType;
  fs.readFile(fname , function (err,data)
          {
          if ( err ) 
          {
            writeFile(image,fname);
          }else {
            log.debug('File already exists' + fname);
          }
          });
}
function writeFile (image,fname)
{
  log.debug('writing file: ' + image.toString() )
  fs.writeFile(fname, image.data,"binary", function (err) {
    if (err) throw err;
    log.info(fname+' saved!');
    log.debug(" * " + image);
  });

}

exports.saveImage = saveImage;
exports.httpGet = httpGet;
exports.downloadImages = downloadImages;
exports.Image = Image
exports.log = log;
