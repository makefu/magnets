var Mag = require('../lib/magnetlib');

exports.createPlugin = function (log) {
    var out = {};
    var MAIN="http://kqe.de/";
    out.LIVE =  undefined; 
    out.BACKWARDS = undefined;
    out.NAME = "KQE.de plugin";

    out.getImages = function getImages(content) { 
      var imageFilter = /<a href="(\S*)" target="_blank" rel="lightbox">/g;
      return Mag.getMatches(imageFilter, content.data);
    };

    out.getNextUrl = function getNextUrl(content) {
        var urlPattern = /<a href="(\S+)">&gt;&gt;<\/a>/
        return  urlPattern.exec(content.data);
    };

    return out;
};
