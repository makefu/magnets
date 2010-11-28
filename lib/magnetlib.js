/*!
 * magnetlib.js is a utility library to simplify http data retrieval
 *
 * @author makefu
 * @author pfleidi
 *
 */

var Http = require('http'),
Fs = require('fs'),
Url = require('url'),
Crypto = require('crypto'),
Sys = require('sys'),
db = require('dirty')('metadata.db'),
HttpClient = require('wwwdude');


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
      matches.push({ url: match[1]});
    }
  }
  return matches;
};

exports.createMaglib = function createMaglib(options) {
  var exp = {},
  imageFolder = options.imageFolder, log = options.log;
  log.debug('creating Maglib');

  function _persistImage(meta_image) {
    var img = new Image(meta_image.url);
    img.download(function getLocalPath(local_path) {
        if (!local_path) {
          log.warn('file already saved on disk but under different url ');

        } else {
          meta_image.path = local_path;
          log.debug('writing meta-infos of ' + meta_image.url);
          db.set(meta_image.url, meta_image);
        }
      });
  }

  exp.downloadImages = function downloadImages(images) {
    images.forEach(function (meta_image) {
        var db_obj = db.get(meta_image.url);
        if (db_obj) {
          Fs.stat(db_obj.path, function (err, stats) {
              if (err || !stats.isFile()) {
                log.warn('Image from ' + meta_image.url + ' already in db but not on FS, redownloading');
                _persistImage(meta_image);
              } else {
                log.debug('Image from ' + meta_image.url + ' already saved before');
              }
            });
        } else {
          log.debug('Initializing saving of new file from ' + meta_image.url + ' to disk');
          _persistImage(meta_image);
        }
      });
  };


  var Image = function Image(imageUrl) {
    this.url = imageUrl;
  };

  Image.prototype.hash = function hash() {
    return Crypto.createHash('sha1').update(this.data).digest("hex");
  };

  Image.prototype._writeToDisk = function _writeToDisk(fname) {
    log.debug('writing file: ' + fname);

    Fs.writeFile(fname, this.data, "binary", function (err) {
        if (err) {
          throw err;
        }
        log.info(fname + ' saved!');
        log.debug(" * " + this);
      });
  };

  Image.prototype._saveFile = function _saveFile(callback) {
    var fname = imageFolder + this.hash() + "." + this.fileType();
    // TODO also write metadata
    var self = this;
    Fs.stat(fname, function (err, stats) {
        if (err || ! stats.isFile()) {
          self._writeToDisk(fname);
          callback(fname);
        } else {
          log.debug('File already exists' + fname);
          callback(undefined);
        }
      });

  };

  Image.prototype.fileName = function () {
    return this.url.split('/').pop();
  };

  Image.prototype.fileType = function () {
    return this.fileName().split('.').pop().replace(/[?].*/, "");
  };

  Image.prototype.save = function save() {
    log.debug('writing file:' + this);
  };

  Image.prototype.download = function download(callback) {
    log.debug('downloading file:' + this.fname);
    var self = this;

    httpGet(this.url, function (ret) {
        self.data = ret.data;
        self._saveFile(callback);
      }, 'binary');
  };

  var httpGet = exp.httpGet = function httpGet(url , callback, encoding) {
    if (!url) {
      throw new Error("No url given! Can't download " + url);
    }

    log.debug('httpGet: ' + url);
    var content = { url : url },
    client = HttpClient.createClient({
        logger: log,
        headers: { 'User-Agent': 'fucking magnets' },
        encoding: encoding
      });

    client.get(url)
    .on('error', function (data, resp) {
        log.error('Error for: ' + url + ' code: ' + resp.statusCode);
      })
    .on('network-error', function (err) {
        log.error('Network Error: ' + url + ' reason: ' + err.message);
      })
    .on('redirect', function (data, resp) {
        log.info('Redirecting to: ' + resp.headers.location);
      })
    .on('success', function (data, resp) {
        content.data = data;
        callback(content);
      }).send();
  };

  return exp;
};


