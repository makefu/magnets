/* This is a prototype entrypoint for our module system */

var mag = require('./lib/magnetlib'),
    fs = require('fs'),
    sys = require('sys');

var log = mag.log;
var modules = new Array();

/* Process Logging */

process.on('uncaughtException', function (err) {
  sys.puts('Caught exception: ' + err);
  log.fatal('Caught exception: ' + err);
});

process.on('SIGINT', function () {
  log.info('Got SIGINT. Exiting ...');
  process.exit(0);
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
      log.warn('Error while reading files: ' + err);
    } else {
      files.forEach(function(file) {
        var name = getModuleName(file);
        log.info('Found module: ' + name);
        modules.push(require('./plugins/' + name));
      });
    }
  });
};

function runModules() {

}


initModules();
