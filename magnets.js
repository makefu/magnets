/* This is a prototype entrypoint for our module system */

var mag = require('./lib/magnetlib'),
    fs = require('fs'),
    sys = require('sys');

var log = mag.log;
var modules = new Array();
var TIMEOUT = 10000
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
  modules = new Array(); 
  fs.readdir('./plugins/', function(err, files) {
    if (err) {
      log.warn('Error while reading files: ' + err);
    } else {
      files.forEach(function(file) {
        var name = getModuleName(file);
        log.info('Found module: ' + name);
        var module = require('./plugins/' + name);
        modules.push(module)
        log.debug('Successfully loaded module: '+ module.NAME);
      });
    }
  });
};

/** @brief runs a live
  *
  * schedules a Live module, will schedule self after TIMEOUT
  *
  * @author   makefu
  * @date     2010-08-01  
  * @param    mod  the module loded by require()
  */
function runLiveMod(mod){
  var img = new mag.Image(mod.LIVE)
  mag.httpGet(img ,function(content) {
    var images = mod.getImages(content);
    mag.downloadImages(images);
  });
}

function runLiveModules() {
  log.info("Running live modules")
  var currTimeout=0;
  modules.forEach(function(mod) {
    log.debug("starting module: "+mod.NAME + " at Timeout "+currTimeout);
    setTimeout(function () { runLiveMod(mod)},currTimeout); 
    currTimeout = currTimeout + TIMEOUT
  });
  setTimeout(runLiveModules,currTimeout); 
}

function main() {
  initModules();
  runLiveModules();
}

main();
