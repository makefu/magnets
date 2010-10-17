/*!
 * magnetlib.js is a utility library to simplify http data retrieval
 *
 * @author makefu
 * @author pfleidi
 *
 */

var http = require('http'),
fs = require('fs'),
sys = require('sys'),
url = require('url'),
crypto = require('crypto')
logger = require('./logger');

var log = new logger.Logger({
  logfile: "./log/magnets.log",
  loglevel: "info",
  logstdout: true,
  color: true
});

/* module exports */

exports.saveImage = saveImage;
exports.httpGet = httpGet;
exports.downloadImages = downloadImages;
exports.Content = Content;
exports.Image = Image;
exports.imageFolder = imageFolder = './images/';// TODO find a way to externally change this value!
exports.newImagesFile = newImagesFile = this.imageFolder+'imageSum';
exports.appendData = appendData;
exports.getMatches = getMatches;
/**
 * Downloadable content
 *
 * @param {String} contentUrl
 * @type Content
 * @api public
 */

function Content(contentUrl) {
  this.url = contentUrl;
  this.data = "";
}

/**
 * @return {String}
 */

Content.prototype.hash = function() {
  return crypto.createHash('sha1').update(this.data).digest("hex");
}


/**
 * @return {String}
 */

Content.prototype.toString = function () {
  return  'url: ' + this.url +
  ' port: ' + this.urlPort() +
  ' hash: ' + this.hash(); 
} 

/**
 * @return {URL}
 */

Content.prototype.parsedUrl = function() {
  return url.parse(this.url);
}

/**
 * @return {Int}
 */

Content.prototype.urlPort = function() {
  var cUri = this.parsedUrl();
  if (cUri.port) {
    return cUri.port;
  } else {
    if (cUri.protocol === 'http:') return 80;
    else if (cUri.protocol === 'https:') return 443;
  }
}

function Image(imageUrl) {
  this.url = imageUrl;
}

Image.prototype = new Content();
Image.prototype.constructor = Image;

Image.prototype.fileName = function() {
  return this.url.split('/').pop();
}

Image.prototype.fileType = function() {
  return this.fileName().split('.').pop();
}


function httpGet(content, callback, encoding) {

  if (!content.url) {
    throw "No url given! Can't download " + content;
  }

  log.debug('httpGet: ' + content.url);

  var parsedUrl = content.parsedUrl();
  var connection = http.createClient(content.urlPort(), parsedUrl.host);
  var queryparms = parsedUrl.query ? '?' + parsedUrl.query :  '';
  var getPath = parsedUrl.pathname + queryparms;

  var request = connection.request('GET', getPath,  
  {"host": parsedUrl.host, "User-Agent": "fucking magnets"});


  request.addListener("response", function(response) {
  response.setEncoding(encoding);

  var image = new Image(content.url);

  response.addListener("data", function(chunk) {
    image.data += chunk;
  });

  response.addListener("end", function() {
    callback(image)
  });
});
request.end();
}

function downloadImages(imageUrls) {
  imageUrls.forEach(function(imageUrl) {
    var img = new Content(imageUrl);
    fs.readFile(this.imageFolder + img.fileName, function(err,data) {
      if (err) {
        httpGet(img, saveImage, "binary");
      } else {
        log.debug("File already exists: " + img);
      }
    });
  });
}

function saveImage(image) {
  log.debug('writing file:' + image); 
  var fname = this.imageFolder + image.hash() + "." + image.fileType();

  fs.readFile(fname , function (err, data) {
    if (err) {
      writeFile(image, fname);
    } else {
      log.debug('File already exists' + fname);
    }
  });
}

function writeFile(image, fname) {
  log.debug('writing file: ' + image.toString() )

  fs.writeFile(fname, image.data,"binary", function (err) {
    if (err) throw err;
    log.info(fname + ' saved!');
    log.debug(" * " + image);
    appendData(newImagesFile, image.hash() + "." + image.fileType() + "\n");
  });
}

/** 
 * appends arbitrary data to given file
 *
 * @author     makefu
 * @date       2010-08-21    
 * @param         filename
 * @return        data to be written
 */
function appendData(file,data){
  fs.open(file,"a+",0755,function (err,fd) {
    if (err) throw err;
    log.debug('appending '+data+' to '+file);
    fs.write(fd,data,function(err,written){
      if (err) throw err;
    });
    fs.close(fd);
  });
}

/** 
  * convenience function which exectues a regular expression and saves
  * every match in a table
  *
  * @author     makefu
  * @date       2010-10-11    
  * @param         regex the regular expression object
  * @param         content the string to validate the regex against
  * @return        an array of all matches
  */
function getMatches(regex, content) {
  var matches = new Array();

  var match; 
  while (match = regex.exec(content)) {
    if(match != null && match != undefined) {
      log.debug("found: "+ match[0]);
      matches.push(match[1]);
    }
  }
  return matches;
}
