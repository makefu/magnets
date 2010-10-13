/*!
 * httpclient.js a thin abstraction layer for http client stuff
 *
 * @author pfleidi 
 *
 */

var Sys = require('sys'),
Http = require('http'),
Meta = require('./meta'),
Url = require('url'),
EventEmitter = require('events').EventEmitter;

var defaultHeaders = {
  'User-Agent': 'node.js client'
};

var defaultLogger = {
  info: Sys.puts,
  fatal: Sys.puts,
  warning: Sys.puts,
  debug: Sys.puts
};

/**
 * Factory funtion to initalize a client
 *
 * @return {Object}
 * @api public
 */
exports.createClient = function createClient(options) {
  var logger = options.logger || defaultLogger,
  encoding = options.encoding || 'utf8',
  clientHeaders = Meta.mergeAttributes(defaultHeaders, options.headers); 

  function Request(method, url, headers, payload) {
    logger.debug('Creating HTTP ' + method + ' request for ' + url);

    this.url = this._parseURL(url);
    headers['host'] = this.url.host;
    this.client = Http.createClient(this.url.port, this.url.hostname);

    if (payload) {
      headers['Content-Length'] = payload.length;
      this.request = this.client.request(method, this.url.path, headers);
      this.request.write(payload, encoding);
    } else {
      this.request = this.client.request(method, this.url.path, headers);
    }

    this.request.addListener('response', this._responseHandler);
  }

  function ProtoRequest() {

    /**
     * Execute a prepared HTTP request
     *
     * @return {undefined}
     * @api public
     */
    this.send = function () {
      this.request.end();
    };

    /**
     * Handle responses of executed HTTP requests
     *
     * @param {Object} response
     * @return {undefined}
     * @api private
     */
    this._responseHandler = function (response) {
      var data = '',
      self = this;

      response.setEncoding(encoding);
      logger.info('Got response with code: ' + response.statusCode);
      logger.debug('Headers : ' + Sys.inspect(response.headers));

      response.addListener('data', function (chunk) {
          data += chunk;
        });

      response.addListener('end', function () {
          if (parseInt(response.statusCode, 10) >= 400) {
            logger.warning("Error: response code " + response.statusCode); 
            self.emit('error', data, response);
          } else {
            logger.info('Transfer complete');
            self.emit('success', data, response);
          }

          logger.debug('Received data: ' + data);
          self.emit('complete', data);
        });
    };

    /**
     * Parse an URL an add some needed properties
     *
     * @param {String} url 
     * @return {Object}
     * @api private
     */
    this._parseURL = function (url) {
      var parsedUrl = Url.parse(url),
      container = {};

      container.port = parsedUrl.port || (parsedUrl.protocol === 'https') ? 443 : 80;
      container.queryparms = parsedUrl.query ? '?' + parsedUrl.query :  '';
      container.path = parsedUrl.pathname || '/' + container.queryparms;

      return Meta.mergeAttributes(parsedUrl, container);
    };

  }

  // Inherit from EventEmitter
  ProtoRequest.prototype = new EventEmitter();
  Request.prototype = new ProtoRequest();

  // return the actual API
  return {

    get: function (url, requestHeaders) {
      var headers = Meta.mergeAttributes(clientHeaders, requestHeaders);
      return new Request('GET', url, headers);
    },

    post: function (url, payload, requestHeaders) {
      var headers = Meta.mergeAttributes(clientHeaders, requestHeaders);
      return new Request('POST', url, headers, payload);
    },

    put: function (url, payload, requestHeaders) {
      var headers = Meta.mergeAttributes(clientHeaders, requestHeaders);
      return new Request('PUT', url, headers, payload);
    },

    del: function (url, requestHeaders) {
      var headers = Meta.mergeAttributes(clientHeaders, requestHeaders);
      return new Request('DEL', url, headers);
    }

  };

};
