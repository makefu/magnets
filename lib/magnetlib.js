/*!
 * magnetlib.js is a utility library to simplify http data retrieval
 *
 * @author makefu
 * @author pfleidi
 *
 */

var Http = require('http'),
Fs = require('fs'),
Sys = require('sys'),
Url = require('url'),
Crypto = require('crypto'),
Log4js = require('log4js'),
Appender = require('./colorappender');

Log4js.addAppender(Appender.consoleAppender());

var imageFolder = './images/', // TODO find a way to externally change this value!
newImagesFile = imageFolder + 'imageSum',
log = Log4js.getLogger('magnetlib');
log.setLevel('INFO');

/**
 * Downloadable content
 *
 * @param {String} contentUrl
 * @type Content
 * @api public
 */
var Content = exports.Content = function Content(contentUrl) {
  this.url = contentUrl;
  this.data = "";
};

/**
 * @return {String}
 */
Content.prototype.hash = function () {
  return Crypto.createHash('sha1').update(this.data).digest("hex");
};


/**
 * @return {String}
 */
Content.prototype.toString = function () {
  return  'url: ' + this.url +
    ' port: ' + this.urlPort() +
    ' hash: ' + this.hash(); 
}; 

/**
 * @return {URL}
 */
Content.prototype.parsedUrl = function () {
  return Url.parse(this.url);
};

/**
 * @return {Int}
 */
Content.prototype.urlPort = function () {
  var cUri = this.parsedUrl();
  if (cUri.port) {
    return cUri.port;
  } else {
    if (cUri.protocol === 'http:') {
      return 80;
    } else if (cUri.protocol === 'https:') {
      return 443;
    }
  }
};

var Image = exports.Image = function Image(imageUrl) {
  this.url = imageUrl;
};

Image.prototype = new Content();
Image.prototype.constructor = Image;

Image.prototype.fileName = function () {
  return this.url.split('/').pop();
};

Image.prototype.fileType = function () {
  return this.fileName().split('.').pop();
};

var httpGet = exports.httpGet = function httpGet(content, callback, encoding) {
  if (!content.url) {
    throw "No url given! Can't download " + content;
  }

  log.debug('httpGet: ' + content.url);

  var parsedUrl = content.parsedUrl(),
  connection = Http.createClient(content.urlPort(), parsedUrl.host),
  queryparms = parsedUrl.query ? '?' + parsedUrl.query :  '',
  getPath = parsedUrl.pathname + queryparms,
  request = connection.request('GET', getPath, {
      "host": parsedUrl.host,
      "User-Agent": "fucking magnets"
    });

  request.addListener("response", function (response) {
      response.setEncoding(encoding);

      var image = new Image(content.url);

      response.addListener("data", function (chunk) {
          image.data += chunk;
        });

      response.addListener("end", function () {
          callback(image);
        });
    });
  request.end();
};

/** 
 * appends arbitrary data to given file
 *
 * @author     makefu
 * @date       2010-08-21    
 * @param         filename
 * @return        data to be written
 */
var appendData = exports.appendData = function appendData(file, data) {
  Fs.open(file, "a+", 0755, function (err, fd) {
      if (err) {
        throw err;
      }
      log.debug('appending ' + data + ' to ' + file);
      Fs.write(fd, data, function (err, written) {
          if (err) {
            throw err;
          }
        });
      Fs.close(fd);
    });
};



function writeFile(image, fname) {
  log.debug('writing file: ' + image.toString());

  Fs.writeFile(fname, image.data, "binary", function (err) {
      if (err) {
        throw err;
      }
      log.info(fname + ' saved!');
      log.debug(" * " + image);
      appendData(newImagesFile, image.hash() + "." + image.fileType() + "\n");
    });
}

var saveImage = exports.saveImage  = function saveImage(image) {
  log.debug('writing file:' + image); 
  var fname = imageFolder + image.hash() + "." + image.fileType();

  Fs.readFile(fname, function (err, data) {
      if (err) {
        writeFile(image, fname);
      } else {
        log.debug('File already exists' + fname);
      }
    });
};

exports.downloadImages = function downloadImages(imageUrls) {
  imageUrls.forEach(function (imageUrl) {
      var img = new Content(imageUrl);
      Fs.readFile(imageFolder + img.fileName, function (err, data) {
          if (err) {
            httpGet(img, saveImage, "binary");
          } else {
            log.debug("File already exists: " + img);
          }
        });
    });
};

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
      exports.getMatches = function getMatches(regex, content) {
        var matches = [];

        var match; 
        while (match = regex.exec(content)) {
          if (match) {
            log.debug("found: " + match[0]);
            matches.push(match[1]);
          }
        }
        return matches;
      };
