/*!
 *  magglogger.js is a configurable logger on top of node-streamlogger
 *
 *  @author pfleidi
 */


var
sys = require('sys'),
streamLogger = require('./streamlogger');

var Logger = exports.Logger = function(options) {
  var logger = this.logger = new streamLogger.StreamLogger(options.logfile);

  if (options.loglevel) {
    if (!(options.loglevel in logger.levels)) throw "Wrong loglevel!" + options.loglevel;
    logger.level = logger.levels[options.loglevel]; 
  } else {
    logger.level = logger.levels.info;
  }


  logger.emitter
  .addListener('error', function(err,logPath) {
    sys.puts("[Error]: " + err + " while writing to " + logPath);
  });

  if (options.logstdout) {
    logger.emitter
    .addListener('loggedMessage-debug', function(message) {
      sys.puts("[DEBUG]: " + message);
    })
    .addListener('loggedMessage-info', function(message) {
      sys.puts("[INFO]: " + message);
    })
    .addListener('loggedMessage-warn', function(message) {
      sys.puts("[WARN]: " + message);
    })
    .addListener('loggedMessage-fatal', function(message) {
      sys.puts("[FATAL]: " + message);
    });
  }

}

Logger.prototype.debug = function(msg) {
  this.logger.debug(msg);
}

Logger.prototype.info = function(msg) {
  this.logger.info(msg);
}

Logger.prototype.warn = function(msg) {
  this.logger.warn(msg);
}

Logger.prototype.fatal = function(msg) {
  this.logger.fatal(msg);
}
