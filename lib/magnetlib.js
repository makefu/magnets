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
HttpClient = require('wwwdude');

exports.createMaglib = function createMaglib(options) {
  var imageFolder = options.imageFolder, log = options.log;

  function _writeFile(image, fname) {
    log.debug('writing file: ' + image.toString());

    Fs.writeFile(fname, image.data, "binary", function (err) {
        if (err) {
          throw err;
        }
        log.info(fname + ' saved!');
        log.debug(" * " + image);
      });
  }

  var Image = function Image(imageUrl) {
    this.url = imageUrl;
  };

  Image.prototype.fileName = function () {
    return this.url.split('/').pop();
  };

  Image.prototype.fileType = function () {
    return this.fileName().split('.').pop().replace(/[?].*/,"");
  };

  Image.prototype.save = function save() {
    log.debug('writing file:' + image);
    var fname = imageFolder + image.hash() + "." + image.fileType();

    Fs.readFile(fname, function (err, data) {
        if (err) {
          _writeFile(image, fname);
        } else {
          log.debug('File already exists' + fname);
        }
      });
  };

  var httpGet = exports.httpGet = function httpGet(url, callback, encoding) {
    if (!url) {
      throw new Error("No url given! Can't download " + url);
    }

    log.debug('httpGet: ' + url);

    var client = HttpClient.createClient({
        logger: log,
        headers: { 'User-Agent': 'fucking magnets' },
        encoding: encoding
      });

    client.get(url)
    .addListener('error', function (data, resp) {
        log.error('Error for: ' + url + ' code: ' + resp.statusCode);
      })
    .addListener('redirect', function (data, resp) {
        log.info('Redirecting to: ' + resp.headers['location']);
      })
    .addListener('success', function (data, resp) {
        callback(data);
      }).send();
  };

  //TODO: borken code, fix me!
  exports.downloadImages = function downloadImages(imageUrls) {
    imageUrls.forEach(function (url) {
        var img = new Image(url);
        img.download();
      });
  };

  /**
   * convenience function which exectues a regular expression and saves
   * every match in a table
   *
   * @author     makefu
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


};
