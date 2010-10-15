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
      var imageFilter = /<img class="image" id="pic\d+" src="(\S+)" width="\d+" height="\d+" alt/g;
      return  Mag.getMatches(imageFilter, content.data);
    };

    out.getNextUrl = function (content) {
        var urlPattern = /<p class="fleft"><a href="(\S+)">/
        return urlPattern.exec(content.data)
    };
    return [out];
};
