var Mag = require('../lib/magnetlib.js'),
    Parse = require('htmlparser'),
    Select = require('soupselect').select,
    Url = require('url');

exports.createPlugin = function (log) {
  var out = {};
  var MAIN="http://www.soup.io/everyone";
  out.LIVE =  undefined; 
  out.BACKWARDS = undefined//MAIN;
  out.NAME = "Soup.io plugin";

  out.getImages = function getImages(content) { 

    var images = [];

    var handler = new Parse.DefaultHandler(function(err,dom) {
      if (err) {
        log.warn("Error: " +err);
      } else {
        try {
          var ret = Select(dom, 'div[class=content-container]');
          ret.forEach(function (container) {
            var pic = {};
            pic['tags'] = [];
            pic['caption'] = "";
            pic['url'] = "";

            try {
              image_container = Select(container, 'div[class=imagecontainer]')[0];
              image_container.children.forEach(function (image) {
                if ( image.name == 'a' ) {
                  log.debug('found big image' + image.attribs['href']);
                  pic['url'] =  Url.resolve(content.url,image.attribs['href']);
                } else if (image.name == 'img') {
                  log.debug('found small image' + image.attribs['src']);
                  pic['url'] = Url.resolve(content.url,image.attribs['src']);
                }
              });
            }catch (err) {
              return; // do not handle this entry

            }
            try {
              tag_container = Select(container,'div[class=tags] a');
              tag_container.forEach(function (tag) {
                tag_field = tag.children[0].raw;  
                log.debug('Found Tag: '+tag_field);
                pic['tags'].push(tag_field);
              });
            }catch (err) {
              log.debug ('No tags?' + err);
            }
            try {
              caption_container = Select(container,'div[class=caption] a');
              caption_container.forEach(function (caption) {
                pic['caption'] = caption.attribs['href'];
              });
            }catch (err) {
              log.debug ('No caption?' + err);
            }
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
    var urlPattern = /<a href=\"([\S]*)\" onclick=\"SOUP.Endless.getMoreBelow/
      var match = urlPattern.exec(content.data);
    var parsedUrl = Url.parse(content.url);
    var front =parsedUrl.protocol+'//'+parsedUrl.host+match[1]
      return front+match[1]
  };

  return [out];
};
