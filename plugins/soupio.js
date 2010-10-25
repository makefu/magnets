var Mag = require('../lib/magnetlib.js'),
    Parse = require('htmlparser'),
    Select = require('soupselect').select,
    Url = require('url');

exports.createPlugin = function (log) {
  var out = {};
  var MAIN="http://www.soup.io/everyone";
  out.LIVE =  undefined; 
  out.BACKWARDS = MAIN;
  out.NAME = "Soup.io plugin";

  out.getImages = function getImages(content) { 

    var images = [];

    var handler = new Parse.DefaultHandler(function(err,dom) {
      if (err) {
        log.warn("Error: " +err);
      } else {
        try {
          var ret = Select(dom, 'div[class=imagecontainer]');
          ret.forEach(function (container) {
            //log.debug('found imagecontainer:'+Sys.inspect(container));
            container.children.forEach(function (image) {
              if ( image.name == 'a' ) {
                log.debug('found big image' + image.attribs['href']);
                images.push(Url.resolve(content.url,image.attribs['href']));
              } else if (image.name == 'img') {
                log.debug('found small image' + image.attribs['src']);
                images.push(Url.resolve(content.url,image.attribs['src']));

              }
            });
          });
        } catch (err) {
          log.warn("Something broke? Url:"+content.url);
          log.warn(err);
        }
        if ( ! images.length )
          log.warn("No images on page? Url:"+content.url);
      }

    });
    var parser = new Parse.Parser(handler);
    parser.parseComplete(content.data);
    return images;
  };

  out.getNextUrl = function getNextUrl(content) {
    var urlPattern = /<a href=\"([\S]*)\" onclick=\"SOUP.Endless.getMoreBelow/
      var match = urlPattern.exec(content.data);
    var parsedUrl = Url.parse(content.url);
    var front =parsedUrl.protocol+'//'+parsedUrl.host+match[1]
      return [0,front+match[1]]
  };

  return [out];
};
