var Mag = require('../lib/magnetlib');

exports.createPlugin = function (log) {
  var out = {} ;
  var MAIN="http://www.bildschirmarbeiter.com/pics/all/";
  out.LIVE =  undefined;
  /// TODO currently you need to find the 
  ///      latest article via www.bildschirmarbeiter.com/pics/all and get the
  ///      first link, this needs to be changed and done automagically
  var BACK = "http://www.bildschirmarbeiter.com/pic/bildschirmarbeiter_-_picdump_08.10.2010/";
  out.BACKWARDS = BACK;
  out.NAME = "Bildschirmarbeiter.com plugin";

  out.getImages = function (content) { 
    var images = [];
    var tags = [];
    var handler = new Parse.DefaultHandler(function(err,dom) {
      if (err) {
        log.warn("Error: " + err);
      } else {
        ret = Select(dom, 'div img[class=image]');
        ret_tags = Select(dom, 'div[class=tags] a');
        try { 
          log.debug('starting tag collection');
          ret_tags.forEach( function (tag) {
            var tag_title = tag.attribs['title'];
            log.debug('found new tag: ' + tag_title);
            tags.push(tag_title);
          });
          log.debug('finished tag collection');
        }catch (err) {
          log.warn("problem while collecting tags " + content.url +" "+Sys.inspect(ret_tags));
        }
        try {
          ret.forEach(function (image){
            images.push({ url : image.attribs['src'], tags : tags});
          });
        }catch (err) {
          log.warn("problem with" + content.url +" "+Sys.inspect(ret));
          log.warn(err);
        }
      }
    });
    var parser = new Parse.Parser(handler);
    parser.parseComplete(content.data);
    return  images;
  };

  out.getNextUrl = function (content) {
    var urlPattern = /<p class="fleft"><a href="(\S+)">/
      return urlPattern.exec(content.data)[1]
  };
  return [out];
};
