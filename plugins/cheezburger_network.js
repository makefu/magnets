var Mag = require('../lib/magnetlib'),
    Sys = require('sys');
var urls = [
    //'http://icanhascheezburger.com/',
    //'http://squee.icanhascheezburger.com/',
    //'http://objects.icanhascheezburger.com/',
    'http://noms.icanhascheezburger.com/',
    //'http://totallylookslike.icanhascheezburger.com/',
    //'http://ifshoescouldkill.com/',
    'http://punditkitchen.com/',
    'http://ihasahotdog.com/',
    'http://actinglikeanimals.com/',
    'http://historiclols.cheezburger.com/',
    'http://epicute.com/',
    'http://roflrazzi.com/',
    'http://musthavecute.com/',
    'http://itmademyday.com/',
    'http://lovelylisting.com/',
    'http://wedinator.com/',
    'http://totsandgiggles.cheezburger.com/',
    'http://ifshoescouldkill.com/',
    'http://thereifixedit.failblog.org/',
    'http://learnfrommyfail.failblog.org/',
    'http://ugliesttattoos.com/',
    'http://upnextinsports.com/',
    'http://oddlyspecific.com/',
    'http://verydemotivational.com/',
    'http://failbook.failblog.org/',
    'http://poorlydressed.com/',
    'http://engrishfunny.failblog.org/',
    'http://mthruf.com/',
    'http://crazythingsparentssay.failblog.org/',
    'http://friendsofirony.com/',
    'http://hackedirl.com/',
    'http://senorgif.com/',
    'http://comixed.com/',
    'http://artoftrolling.com/',
    'http://thisisphotobomb.com/',
    'http://graphjam.com/',
    'http://pictureisunrelated.com/',
    'http://derp.cheezburger.com/',
    'http://thedailywh.at/',
    'http://epicwinftw.com/',
    'http://hawtness.com/'
    ];
exports.createPlugin = function (log)
{
    ret = []
    urls.forEach(function (url)
    {
        ret.push(genPlugin(log,url));
    });
    return ret;
}
function genPlugin(log,url) {
    var out = {};
    var MAIN=url;
    out.LIVE =  undefined;
    out.BACKWARDS = MAIN;
    out.NAME = url+" plugin";


    out.getImages = function getImages(content) { 
      var imageFilter = /<img[ ]*([ ]*src=["'](\S+)["']|[ ]*alt=["'][\S ]+?["']|[ ]*title=["'][\S ]+?['"]){3}[ ]*>/g
      images = Mag.getMatches(imageFilter, content.data);
      return images;
    };

    out.getNextUrl = function getNextUrl(content) {
        var urlPattern = /<a href=['"](\S+?)['"][ ]?>Next/
        ret = urlPattern.exec(content.data)
        return ret;
    };

    return out;
};
