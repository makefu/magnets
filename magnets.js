/* This is a prototype entrypoint for our module system */

var mag = require('./lib/magnetlib'),
  fs = require('fs'),
  sys = require('sys');

var log = mag.log;

/* Process Logging */

process.on('uncaughtException', function (err) {
  sys.puts('Caught exception: ' + err);
  log.info('Caught exception: ' + err);
});

process.on('SIGINT', function () {
  log.info('Got SIGINT.  Press Control-D to exit.');
});

process.on('exit', function () {
  log.info('Exited successfully ...');
});

function getModuleName(fileName) {
  return fileName.split('\.')[0];
}

function initModules() {
  fs.readdir('./plugins/', function(err, files) {
    if (err) {
      log.warn('Error in initModules: ' + err);
    } else {
      files.forEach(function(file) {
        sys.puts('Module: ' + getModuleName(file));
      });
    }
  });
};


initModules();
