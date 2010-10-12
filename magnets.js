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

var modules = [];
var MODULE_FOLDER = "./plugins/";
var DEFAULT_TIMEOUT = 10000;
var TIMEOUT = DEFAULT_TIMEOUT;

var log = new logger.Logger({
  logfile: "./log/magnets.log",
  loglevel: "debug",
  logstdout: true,
  color: true
});


/* Process Logging */

process.on('SIGINT', function () {
  log.info('Got SIGINT. Exiting ...');
  process.exit(0);
});

/**
 * @param   {String} fileName
 * @return  {String} 
 */

function getModuleName(fileName) {
  return fileName.split('\.')[0];
}

/**
 * Scans the MODULE_FOLDER directory for modules
 *
 * all modules are stored inside modules
 */

function initModules() {
  modules = [];
  fs.readdir(MODULE_FOLDER, function(err, files) {
    if (err) {
      log.warn('Error while reading files: ' + err);
    } else {
      files.forEach(function(file) {
        var name = getModuleName(file);
        log.info('Found module: ' + name);
        var module = require(MODULE_FOLDER + name);
        modules.push(module);
        log.debug('Successfully loaded module: '+ module.NAME);
        log.info('Starting Backwards Crawling for ' + module.NAME);
        runBackMod(module, module.BACKWARDS);
      });
    }
  });
};

/** 
 * runs a live crawl for given module
 *
 * schedules a Live module
 *
 * @param    mod  the module loded by require()
 */

function runLiveMod(mod) {
  var img = new mag.Content(mod.LIVE)
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

var curr_timeout = DEFAULT_TIMEOUT; // TODO unGlobalize me
function runBackMod(mod,cUrl) {
  if (cUrl == undefined) {
    log.info(mod.NAME + ' cannot be crawled backwards or is disable')
    return;
  }

  log.info('backwards crawling '+cUrl);
  var cont = new mag.Content(cUrl);
  mag.httpGet(cont,function(ret) {
    var mUrl = mod.getNextUrl(ret);
    var imgs = mod.getImages(ret);

    if (imgs.length == 0) {
      curr_timeout = curr_timeout/2;
    } else {
      curr_timeout = DEFAULT_TIMEOUT;
      mag.downloadImages(imgs);
    }
    if (mUrl != undefined) {
      setTimeout( function () { runBackMod(mod, mUrl) }, curr_timeout); 
    } else {
      log.warn(cUrl + ' End of page?');
    }
  });
}

function runBackwardsModules() {
  log.info("Running Backwards-in-Time modules");
  var currTimeout = 0;

  modules.forEach(function(mod) {
    log.debug("starting module: " + mod.BACKWARDS + " at Timeout " + currTimeout);
    setTimeout(function () { runBackMod(mod,mod.BACKWARDS) }, currTimeout); 
    currTimeout = currTimeout + TIMEOUT;
  });

}

function main() {
  initModules();
  //runLiveModules(); TODO conditional for running live
  runBackwardsModules(); //TODO needs to have modules intialized before
}

main();
