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

var Fs = require('fs'),
Sys = require('sys'),
Log4js = require('log4js'),
argv = require('optimist').usage('Usage: $0 --loglevel LEVEL').argv,
Appender = require('./lib/colorappender.js');

var modules = [],
PLUGIN_FOLDER = __dirname + "/plugins/",
LOGFILE = __dirname + '/log/magnets.log',
DEFAULT_TIMEOUT = 10000,
LOG_LEVEL = argv.loglevel || argv.l || 'INFO';
TIMEOUT = DEFAULT_TIMEOUT;

Log4js.addAppender(Appender.consoleAppender());
//Log4js.addAppender(Log4js.fileAppender(LOGFILE), 'magnets');

var log = Log4js.getLogger('magnets');
log.setLevel(LOG_LEVEL);

var mag = require('./lib/magnetlib').createMaglib({
    imageFolder : __dirname + '/images/',
    log: log
  });

/* Process Logging */

process.on('SIGINT', function () {
    log.info('Got SIGINT. Exiting ...');
    process.exit(0);
  });

process.on('uncaughtException', function (err) {
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

function runBackMod(mod, url) {
  log.info('backwards crawling ' + url);

  if (!url) {
    log.info(mod.NAME + ' cannot be crawled backwards or is disabled');
    return;
  }

  mag.httpGet(url, function (ret) {
      var mUrl = mod.getNextUrl(ret),
      imgs = mod.getImages(ret);

      var meta_images  = imgs.map(function (img) { // TODO change every plugin
        return {url: img};
      });
      if (imgs.length === 0) {
        curr_timeout = curr_timeout / 2;
        log.warn(mUrl[1] + ' no images on page?');
      } else {
        curr_timeout = DEFAULT_TIMEOUT;
        mag.downloadImages(meta_images);
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
 * all modules are stored inside of the modules array
 */
function initModules() {
  modules = [];

  Fs.readdirSync(PLUGIN_FOLDER).forEach(function (file) {
      if (/\.js$/.test(file)) {
        var name = getPluginName(file),
        logger = Log4js.getLogger(name),
        mods = require(PLUGIN_FOLDER + name).createPlugin(logger);

        log.info('Found plugin: ' + name);
        mods.forEach(function (module) {
            log.debug('Successfully loaded module: ' + module.NAME + ' from Plugin ' + name);
            modules.push(module);
          });
      }
    });
}

/**
 * runs a live crawl for given module
 * schedules a Live module
 *
 * @param    mod  the module loded by require()
 */
function runLiveMod(mod) {
  mag.httpGet(mod.LIVE, function (content) {
      var images = mod.getImages(content);
      mag.downloadImages(images);
    });
}

/**
 * Schedules live crawls for all available modules
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


/*
 * main function.
 * magnets is started here
 */
(function main() {
    initModules();
    runBackwardsModules();
    //runLiveModules(); TODO conditional for running live
  }());
