/*!
 * httpclient.js a thin abstraction layer for http client stuff
 *
 * @author pfleidi 
 *
 */

var Sys = require('sys'),
Http = require('http'),
Meta = require('./meta'),
Url = require('url');

var defaultHeaders = {
  'Accept': '*/*',
  'User-Agent': 'node.js client'
};

var defaultLogger = {
  info: Sys.puts,
  fatal: Sys.puts,
  warning: Sys.puts,
  debug: Sys.puts
};

function urlHelper(myUrl) {
  var parsedUrl = Url.parse(myUrl);

  this.port = parsedUrl.port || (parsedUrl.protocol === 'https') ? 443 : 80;
  this.queryparms = parsedUrl.query ? '?' + parsedUrl.query :  '';
  this.path = parsedUrl.pathname + this.queryparms;

  return Meta.mergeAttributes(parsedUrl, this);
}


function createClient(options) {
  var logger = options.logger || defaultLogger,
      encoding = options.encoding || 'utf8',
      headers = Meta.mergeAttributes(defaultHeaders, options.headers); 

  logger.debug('Created new HTTP Client');

  function Request(method, url, headers, payload) {
    var helper = urlHelper(url),
        client = Http.createClient(helper.urlPort, helper.hostname);

    logger.info('HTTP ' + method + ' request for ' + url);

    this.request = client.request(method, helper.path, headers);
    this.request.write(payload, 'utf8');

    request.end();
  }

  Request.prototype = new process.EventEmitter();


  Request.prototype.addListener = function (listener) {
    this.request.addListener('response', function (response) {
      var data = '';

      response.setEncoding(encoding);
      logger.info('Got response with code: ' + response.statusCode);
      logger.debug('Headers : ' + JSON.stringify(response.headers));

      response.addListener('data', function (chunk) {
        data += chunk;
      });

      response.addListener('end', function () {
        logger.info('Transfer complete');
        logger.debug('Received data: ' + data);
        listener(data);
      });
    });

  };


  return {
    get: function (url, requestHeaders) {
      var requestHeaders = Meta.mergeAttributes(headers, requestHeaders);
      return (new Request('GET', requestHeaders).run();
    },

    post: function (url, payload, requestHeaders) {
      var requestHeaders = Meta.mergeAttributes(headers, requestHeaders);
      return (new Request('POST', requestHeaders, payload).run();
    },

    put: function (url, payload, requestHeaders) {
      var requestHeaders = Meta.mergeAttributes(headers, requestHeaders);
      return (new Request('PUT', requestHeaders, payload).run();
    }

    del: function (url, requestHeaders) {
      var requestHeaders = Meta.mergeAttributes(headers, requestHeaders);
      return (new Request('DELETE', requestHeaders, payload).run();
    }
  }

}
