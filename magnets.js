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

var Mag = require('./lib/magnetlib'),
Fs = require('fs'),
Sys = require('sys'),
Log4js = require('log4js');

var modules = [],
PLUGIN_FOLDER = __dirname + "/plugins/",
LOGFILE = __dirname + '/log/magnets.log',
DEFAULT_TIMEOUT = 10000,
TIMEOUT = DEFAULT_TIMEOUT;

Log4js.loadAppender('file');
Log4js.addAppender(Log4js.appenders.file(LOGFILE), 'magnets');

var log = Log4js.getLogger('magnets');
log.setLevel('ERROR');

/* Process Logging */

process.on('SIGINT', function () {
    log.info('Got SIGINT. Exiting ...');
    process.exit(0);
  });

process.on('uncaughtException', function(err) {
    log.fatal('RUNTIME ERROR! :' + err.stack);
});


/**
 * @param   {String} fileName
 * @return  {String} 
 */

function getPluginName(fileName) {
  return fileName.split('.')[0];
}

var curr_timeout = DEFAULT_TIMEOUT; // TODO unGlobalize me

function runBackMod(mod, cUrl) {
  log.info('backwards crawling ' + cUrl);

  if (!cUrl) {
    log.info(mod.NAME + ' cannot be crawled backwards or is disabled');
    return;
  }

  var cont = new Mag.Content(cUrl);
  Mag.httpGet(cont, function (ret) {
      var mUrl = mod.getNextUrl(ret),
      imgs = mod.getImages(ret);

      if (imgs.length === 0) {
        curr_timeout = curr_timeout / 2;
        log.warn(mUrl[1] + ' no images on page?');
      } else {
        curr_timeout = DEFAULT_TIMEOUT;
        Mag.downloadImages(imgs);
      }

      if (mUrl) {
        mUrl = mUrl[1];
        log.debug("Next url is: " + mUrl);
        setTimeout(function () {
            runBackMod(mod, mUrl);
          }, curr_timeout); 
      } else {
        log.warn(mod.NAME + ' End of page?');
      }
    });
}



function runBackwardsModules() {
  log.info("Running Backwards-in-Time modules");
  var currTimeout = 0;

  modules.forEach(function (mod) {
      if (!mod.BACKWARDS) {
        log.info('Skipping ' + mod.NAME + ' because backwards crawling is disabled ');
        return;
      }
      log.debug("starting module: " + mod.BACKWARDS + " at Timeout " + currTimeout);

      setTimeout(function () {
          runBackMod(mod, mod.BACKWARDS);
        }, currTimeout); 

      currTimeout = currTimeout + TIMEOUT;
    });
}

/**
 * Scans the PLUGIN_FOLDER directory for modules
 *
 * all modules are stored inside modules
 */

function initModules() {
  modules = [];
  Fs.readdir(PLUGIN_FOLDER, function (err, files) {
      if (err) {
        log.warn('Error while reading files: ' + err);
      } else {
        files.forEach(function (file) {
            if (/\.js$/.test(file)) {
              var name = getPluginName(file),
              logger = Log4js.getLogger(name),
              mods = require(PLUGIN_FOLDER + name).createPlugin(logger);

              log.info('Found plugin: ' + name);
              mods.forEach(function (module) {
                  log.debug('Successfully loaded module: ' + module.NAME + ' from Plugin ' + name);
                  modules.push(module);
                });
              //runBackMod(module, module.BACKWARDS);
            }
          });
        runBackwardsModules(); //TODO needs to have modules intialized before
      }
    });
}

/** 
 * runs a live crawl for given module
 *
 * schedules a Live module
 *
 * @param    mod  the module loded by require()
 */

function runLiveMod(mod) {
  var img = new Mag.Content(mod.LIVE);

  Mag.httpGet(img, function (content) {
      var images = mod.getImages(content);
      Mag.downloadImages(images);
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

  modules.forEach(function (mod) {
      log.debug("starting module: " + mod.NAME + " at Timeout " + currTimeout);
      setTimeout(function () {
          runLiveMod(mod);
        }, currTimeout); 
      currTimeout = currTimeout + TIMEOUT;
    });

  setTimeout(runLiveModules, currTimeout); 
}



(function main() {
    initModules();
    //runLiveModules(); TODO conditional for running live
  }());
