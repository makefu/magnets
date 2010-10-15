var Mag = require('../lib/magnetlib'),
    Url = require('url');

exports.createPlugin = function (log) {
    var out = {};
    var MAIN="http://www.soup.io/everyone";
    out.LIVE =  undefined; 
    out.BACKWARDS = undefined;
    out.NAME = "Soup.io plugin";

    out.getImages = function getImages(content) { 
      var imageFilter = /<img .* src=['"]{1}([\S]*)['"]{1}\s?(.*)\/>/g;
      var refFilter = /<a .*href=['"]{1}([\S]*)['"]{1}\s?class="lightbox"(.*)>/g;
      images = [];

      while (match = imageFilter.exec(content.data)) {
        if(match != null && match != undefined) {
          if( ! match[0].match(/-square/)) {
            log.debug("found: "+ match[0]);
            images.push(match[1]);
          }
        }
      }
     return Mag.getMatches(refFilter,content.data).concat(images);
    };

    out.getNextUrl = function getNextUrl(content) {
        var urlPattern = /<a href=\"([\S]*)\" onclick=\"SOUP.Endless.getMoreBelow/
        var match = urlPattern.exec(content.data);
        var parsedUrl = Url.parse(content.url);
        var front =parsedUrl.protocol+'//'+parsedUrl.host+match[1]
        return [0,front+match[1]]
    };

    return out;
};
