var Mag = require('../lib/magnetlib.js'),
    Parse = require('htmlparser'),
    Select = require('soupselect').select,
    Url = require('url');

exports.createPlugin = function (log) {
  var out = {};
  var MAIN="http://mm12.tumblr.com";
  out.LIVE =  undefined; 
  out.BACKWARDS = MAIN;
  out.NAME = "Tumblr plugin";

  out.getImages = function getImages(content) { 

    var images = [];

    var handler = new Parse.DefaultHandler(function(err,dom) {
      if (err) {
        log.warn("Error: " +err);
      } else {
        try {
          var ret = Select(dom, 'div[class=photo]');
          ret.forEach(function (container) {
            var pic = {};
            pic['tags'] = [];
            pic['caption'] = "";
            pic['url'] = container.attribs['src'];
            images.push(pic);
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
    var urlPattern = /<span class="next-page"><a href="\(/page/[0-9]*\)">Next Page/
      var match = urlPattern.exec(content.data);
    var parsedUrl = Url.parse(content.url);
    var front =parsedUrl.protocol+'//'+parsedUrl.host+match[1]
      return front+match[1]
  };

  return [out];
};
