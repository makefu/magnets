var Mag = require('../lib/magnetlib'),
    Url = require('url');

exports.createPlugin = function (log) {
  var out = {};

  // currently via wget http://roothausen.soup.io/friends and watch the
  // redirect
  //
  // TODO automate this!
  // TODO add changes from soupio.js
  var SESSION_ID='76580dfb264fcc226c1029121c240dc7'
    var USERNAME='makefu'
    var MAIN='http://'+USERNAME+'.soup.io/friends?sessid='+SESSION_ID
    out.NAME = "Soup.io friends plugin";
  out.LIVE =  undefined; 
  out.BACKWARDS = undefined//MAIN;

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
                images.push( { url : Url.resolve(content.url,image.attribs['src'])});

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
    var urlPattern = /<a href=["']{1}([\S]*)["']{1}\sonclick=['"]{1}SOUP\.Endless\.getMore/;
    var match = urlPattern.exec(content.data);
    var parsedUrl = Url.parse(content.url);
    var front =parsedUrl.protocol+'//'+parsedUrl.host+match[1]
      return front+match[1]
  };
  return [out];
};
