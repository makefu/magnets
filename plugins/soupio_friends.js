var Mag = require('../lib/magnetlib'),
    Url = require('url');

exports.createPlugin = function (log) {
    var out = {};

    // currently via wget http://roothausen.soup.io/friends and watch the
    // redirect
    //
    // TODO automate this!
    var SESSION_ID='444c1d7987cc2e74e94834a335df74a7'
    var USERNAME='roothausen'
    var MAIN='http://'+USERNAME+'.soup.io/friends?sessid='+SESSION_ID
    out.NAME = "Soup.io plugin";
    out.LIVE =  undefined; 
    out.BACKWARDS = undefined;

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
        var urlPattern = /<a href=["']{1}([\S]*)["']{1}\sonclick=['"]{1}SOUP\.Endless\.getMore/;
        var match = urlPattern.exec(content.data);
        var parsedUrl = Url.parse(content.url);
        var front =parsedUrl.protocol+'//'+parsedUrl.host+match[1]
        return [0,front+match[1]]
    };
    return out;
};
