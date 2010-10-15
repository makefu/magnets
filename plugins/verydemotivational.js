var Mag = require('../lib/magnetlib');

exports.createPlugin = function (log) {
    var out = {};
    var MAIN="http://verydemotivational.com/";
    out.LIVE =  undefined;
    out.BACKWARDS = MAIN;
    out.NAME = "verydemotivational.com plugin";


    out.getImages = function getImages(content) { 
      var imageFilter = /<img src=["'](\S+)["'] alt="[\s\S]+" title="[\s\S]*">/g;
      return Mag.getMatches(imageFilter, content.data);
    };

    out.getNextUrl = function getNextUrl(content) {
        var urlPattern = /<a href="(\S+)"\s*>Next/
        return  urlPattern.exec(content.data);
    };

    return out;
};
