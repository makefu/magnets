/*!
 *  magglogger.js is a configurable logger on top of node-streamlogger
 *
 *  @author pfleidi
 */

var sys = require('sys'),
streamLogger = require('./streamlogger'),
style = require('./colored').foreground;

var COLORS = {
  debug: style.green,
  info: style.yellow,
  warn: style.red,
  fatal: style.red
};

function Helper(logger, options) {

  this.getLogLevel = function () {
    if (options.loglevel) {
      if (!logger.levels.hasOwnProperty(options.loglevel)) {
        throw "Wrong loglevel!" + options.loglevel;
      }
      return logger.levels[options.loglevel];
    }
    return logger.levels.info;
  };

  this.getColorLevel = function (loglevel) {
    if (options.color) {
      return COLORS[loglevel]("[" + loglevel + "]");
    } else {
      return "[" + loglevel + "]";
    }
  };
}

var Logger = exports.Logger = function (options) {
  var logger = this.logger = new streamLogger.StreamLogger(options.logfile),
      helper = new Helper(logger, options);

  logger.level = helper.getLogLevel();

  logger.emitter.addListener('error', function (err, logPath) {
      sys.puts("[Error]: " + err + " while writing to " + logPath);
    });

  if (options.logstdout) {
    logger.emitter.addListener('loggedMessage', function (message, logLevel) {
        sys.puts(helper.getColorLevel(logLevel) + ": " + message);
      });
  }
};

Logger.prototype = {
  debug : function (msg) {
    this.logger.debug(msg);
  },

  info : function (msg) {
    this.logger.info(msg);
  },

  warn : function (msg) {
    this.logger.warn(msg);
  },

  fatal : function (msg) {
    this.logger.fatal(msg);
  }
};
