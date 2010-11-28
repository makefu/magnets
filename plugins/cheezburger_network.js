
    Parse = require('htmlparser'),
    Select = require('soupselect').select,
    Url = require('url'),
    Sys = require('sys');
var urls = [
    //'http://history.icanhascheezburger.com/',
    'http://thereifixedit.failblog.org/',
    'http://icanhascheezburger.com/',
    'http://squee.icanhascheezburger.com/',
    'http://objects.icanhascheezburger.com/',
    'http://noms.icanhascheezburger.com/',
    'http://totallylookslike.icanhascheezburger.com/',
    'http://news.icanhascheezburger.com/',
    'http://dogs.icanhascheezburger.com/',
    'http://animals.icanhascheezburger.com/',
    'http://epicute.icanhascheezburger.com/',
    'http://celebs.icanhascheezburger.com/',
    'http://stuff.icanhascheezburger.com/',
    //'http://immd.icanhascheezburger.com/',
    //'http://lovelylisting.icanhascheezburger.com/',
    //'http://wedinator.icanhascheezburger.com/',
    //'http://babies.icanhascheezburger.com/',
    //'http://learnfrommyfail.failblog.org/',
    'http://ugliesttattoos.failblog.org/',
    //'http://sports.failblog.org/',
    'http://oddlyspecific.failblog.org/',
    'http://work.failblog.org/',
    'http://win.failblog.org/',
    'http://verydemotivational.com/',
    //'http://failbook.failblog.org/',
    'http://poorlydressed.failblog.org/',
    'http://engrishfunny.failblog.org/',
    //'http://crazythingsparentssay.failblog.org/', does not compute
    'http://senorgif.com/',
    'http://comixed.com/',
    'http://artoftrolling.com/',
    'http://thisisphotobomb.com/',
    'http://graphjam.com/',
    'http://pictureisunrelated.com/',
    'http://derp.cheezburger.com/',
    // 'http://thedailywh.at/', does not work for shit!
    'http://epicwinftw.com/',
    'http://women.hawtness.com/'
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
    var MAIN= url;
    out.LIVE =  undefined;
    out.BACKWARDS = undefined//MAIN;
    out.NAME = url+" plugin";


    out.getImages = function getImages(content) { 
        var images =[];
        var handler = new Parse.DefaultHandler(function(err,dom) {
            //log.debug(Sys.inspect(dom))
            if (err) {
                log.warn("Error: " + err);
            } else {
                ret = Select(dom, 'div[class=entry] img[title]');
                try {
                      ret.forEach(function (image){
                          images.push( { url: Url.resolve(content.url,image.attribs['src'])});
                      });
                }catch (err) {

                    log.warn("problem with" + content.url +" "+Sys.inspect(ret));
                    log.warn(err);
                }
            }
        });
        var parser = new Parse.Parser(handler);
        parser.parseComplete(content.data);
        return images;
    };

    out.getNextUrl = function getNextUrl(content) {
        var pattern = /^Next/;
        var nextUrl = null;
        var handler = new Parse.DefaultHandler(function(err,dom) {
            if (err) {
                log.warn("Error: " + err);
            } else {
                ret = Select(dom, 'a[href]');
                ret.forEach(function (link){
                    //log.warn(Sys.inspect(link))
                    if ( link.children && pattern.test(link.children[0].data) ) {
                        nextUrl = Url.resolve(content.url,link.attribs['href']);
                    }
                });
            }
        });
        var parser = new Parse.Parser(handler);
        parser.parseComplete(content.data);
        return nextUrl;
    };

    return out;
};
