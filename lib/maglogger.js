/*!
 *  magglogger.js is a configurable logger on top of node-streamlogger
 *
 *  @author pfleidi
 */


var
sys = require('sys'),
streamLogger = require('./streamlogger');
style = require('./colored');

var Logger = exports.Logger = function(options) {
  var logger = this.logger = new streamLogger.StreamLogger(options.logfile);
  var helper = new Helper(logger, options)

  logger.level = helper.getLogLevel();

  logger.emitter
  .addListener('error', function(err,logPath) {
    sys.puts("[Error]: " + err + " while writing to " + logPath);
  });

  if (options.logstdout) {
    logger.emitter
    .addListener('loggedMessage', function(message, logLevel) {
      sys.puts(helper.getColorLevel(logLevel) + ": " + message);
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

function Helper(logger, options) {

  this.getLogLevel = function() {
    if (options.loglevel) {
      if (!(options.loglevel in logger.levels)) throw "Wrong loglevel!" + options.loglevel;
      return logger.levels[options.loglevel]; 
    }
    return logger.levels.info;
  }

  this.getColorLevel = function(loglevel) {
    if (options.color) {
      var prefix = "";
      switch (loglevel) {
        case "debug": return style.blue("["+ loglevel +"]");
        case "info": return style.yellow("["+ loglevel +"]");
        case "warn": return style.red("["+ loglevel +"]");
        case "debug": return style.bold(style.red("["+ loglevel +"]"));
      }
      } else return "["+ loglevel +"]";
    }

  }
