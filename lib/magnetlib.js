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
  var exp = {};
  var imageFolder = options.imageFolder, log = options.log;
  log.debug('creating Maglib');

  function _writeFile(image, fname) {
    log.debug('writing file: ' + fname);

    Fs.writeFile(fname, image.data, "binary", function (err) {
        if (err) {
          throw err;
        }
        log.info(fname + ' saved!');
        log.debug(" * " + this);
      });
  };


  var Image = function Image(imageUrl) {
    this.url = imageUrl;
  };

  Image.prototype.hash = function hash () {
    return Crypto.createHash('sha1').update(this.data).digest("hex");
  };

  Image.prototype._saveFile = function _saveFile(){
    var fname = imageFolder + this.hash() + "." + this.fileType();
    // TODO also write metadata
    var self = this;
    Fs.stat(fname, function (err,stats) {
        if (err || ! stats.isFile()) {
          _writeFile(self, fname);
        } else {
          log.debug('File already exists' + fname);
        }
      });
  };

  Image.prototype.fileName = function () {
    return this.url.split('/').pop();
  };

  Image.prototype.fileType = function () {
    return this.fileName().split('.').pop().replace(/[?].*/,"");
  };

  Image.prototype.save = function save() {
    log.debug('writing file:' + this);
  };

  Image.prototype.download = function download() {
    log.debug('downloading file:' + this.fname);
    var self = this;
    httpGet(this.url,function (ret) {
      self.data = ret.data;
      self._saveFile();
    },'binary');
  };

  var httpGet = exp.httpGet = function httpGet(url, callback, encoding) {
    if (!url) {
      throw new Error("No url given! Can't download " + url);
    }

    log.debug('httpGet: ' + url);
    var content = { url : url };
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
        content.data = data;
        callback(content);
      }).send();
  };

  exp.downloadImages = function downloadImages(imageUrls) {
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
  exp.getMatches = function getMatches(regex, content) {
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

  return exp;
};
