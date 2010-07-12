// soup.io module

var mag = require('./lib/magnetlib'),
    sys = require('sys'),
    url = require('url');

var log = mag.log;
var DEFAULT_TIMEOUT = 3000;
var TIMEOUT =DEFAULT_TIMEOUT;
var MAINPAGE="http://www.soup.io/everyone";

function crawlerfunct(content) {
  var images = getImages(content);
  mag.downloadImages(images);
}

function getImages(content) {
  content = content.data;
  var imageFilter = /<img .* src=['"]{1}([\S]*)['"]{1}\s?(.*)\/>/g;
  var refFilter = /<a .*href=['"]{1}([\S]*)['"]{1}\s?class="lightbox"(.*)>/g;
  var images = new Array();

  //TODO: REFACTOR ME!
  while (match = imageFilter.exec(content)) {
    if(match != null && match != undefined) {
      if( ! match[0].match(/-square/)) {
        log.debug("found: "+ match[0])
        images.push(match[1]);
      }
    }
  }

  var refImages  = getMatches(refFilter, content);

  return refImages.concat(images);

}

function getMatches(regex, content) {
  var matches = new Array();

  var match; 
  while (match = regex.exec(content)) {
    if(match != null && match != undefined) {
      log.debug("found: "+ match[0]);
      matches.push(match[1]);
    }
  }
  return matches;

}

/*
 * @brief live crawl of main page
 */
function crawl(crawlUrl  ) {
    crawlUrl = crawlUrl || "http://www.soup.io/everyone";

    var img = new mag.Image(crawlUrl)
    log.info("Start crawling SoupIO:"+crawlUrl);
    mag.httpGet(img, crawlerfunct, "utf8");
}

function crawlBack(cUrl) {
    cUrl = cUrl || "http://www.soup.io/everyone";
    log.info("crawling " + cUrl);
    //crawl(cUrl);
    getNextUrl(cUrl);
}

function getNextUrl(cUrl) {
    //TODO refactor me ( do not want to request webpage again ...
    log.debug('trying to get data from :'+cUrl);
    var img = new mag.Image(cUrl)
    mag.httpGet(img  ,function(ret) {
      var mUrl = parseNextUrl(ret);
      var imgs = getImages(ret) ;
      if ( imgs.length == 0 ) {
        TIMEOUT = 500;
      }
      else {
        TIMEOUT = DEFAULT_TIMEOUT;
        mag.downloadImages(imgs);
      }
      if ( mUrl != undefined ) {
        setTimeout( function () {crawlBack(mUrl) },TIMEOUT); }
    });
}

function parseNextUrl(content) {
    var urlPattern = /<a href=\"([\S]*)\" onclick=\"SOUP.Endless.getMoreBelow/
    var match = urlPattern.exec(content.data)
    if(match != null && match != undefined) {
        var parsedUrl = url.parse(content.url);
        var front =parsedUrl.protocol+'//'+parsedUrl.host+match[1]
        log.debug("next url is: "+ front);
        return front
    } else {
        // this should never happen
        // means we reached the end of the soup.io
        log.warn("Didn't find next url, assumed we reached the end of soup.io");

        return undefined;
    }
}

crawlBack ();
