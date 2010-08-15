/**
 * This is the main scheduler for magnets.js
 * 
 * It's main purpose is to manage and schedule
 * modules for different websites
 *
 * @author makefu
 * @author pfleidi
 *
 */

var mag = require('./lib/magnetlib'),
  fs = require('fs'),
  sys = require('sys');

var log = mag.log;
var modules = [];
var TIMEOUT = 10000;

/* Process Logging */

process.on('uncaughtException', function (err) {
  sys.puts('Caught exception: ' + err);
  log.fatal('Caught exception: ' + err);
});

process.on('SIGINT', function () {
  log.info('Got SIGINT. Exiting ...');
  process.exit(0);
});

/**
 * @param   {String} fileName
 * @return  {String} 
 *
 */

function getModuleName(fileName) {
  return fileName.split('\.')[0];
}

/**
 * Scans the ./plugins/ directory for modules
 *
 * all modules are stored inside modules
 */

function initModules() {
  modules = [];
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

/** 
 * runs a crawl for given module
 *
 * schedules a Live module
 *
 * @param    mod  the module loded by require()
 */

function runLiveMod(mod){
  var img = new mag.Image(mod.LIVE)
  mag.httpGet(img, function(content) {
    var images = mod.getImages(content);
    mag.downloadImages(images);
  });
}

/**
 * Schedules live crawls for all available modules
 *
 * All modules are re-scheduled after TIMEOUT
 *
 */

function runLiveModules() {
  log.info("Running live modules");
  var currTimeout = 0;
  
  modules.forEach(function(mod) {
    log.debug("starting module: " + mod.NAME + " at Timeout " + currTimeout);
    setTimeout(function () { runLiveMod(mod) }, currTimeout); 
    currTimeout = currTimeout + TIMEOUT;
  });

  setTimeout(runLiveModules, currTimeout); 
}

function main() {
  initModules();
  runLiveModules();
}

main();
