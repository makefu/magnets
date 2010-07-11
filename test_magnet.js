// soup.io module

var mag = require('./lib/magnetlib'),
    sys = require('sys'),
    url = require('url');

var log = mag.log;
var TIMEOUT = 3000;
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

    log.info("Start crawling SoupIO");
    mag.httpGet({url: crawlUrl, data: ''}, crawlerfunct, "utf8");
}

function crawlBack(cUrl) {
    cUrl = cUrl || "http://www.soup.io/everyone";
    log.info("crawling " + cUrl);
//    crawl(cUrl);
    getNextUrl(cUrl);
}

function getNextUrl(cUrl) {
    //TODO refactor me ( do not want to request webpage again ...
    log.debug('trying to get data from :'+cUrl);
    mag.httpGet(  {url: cUrl, data: ''},function(ret){
            var mUrl = parseNextUrl(ret);
            if ( url != undefined ) {
                setTimeout( crawlBack(mUrl),TIMEOUT);
            }
        });
}

function parseNextUrl(content) {
    urlPattern = /SOUP.Endless.next_url = \'([\S]*)\'/ ;
    match = urlPattern.exec(content.data);

    if(match != null && match != undefined) {
        log.debug("next url is: "+ match[1]);
        var parsedUrl = url.parse(content.url);
        return parsedUrl.protocol+'//'+parsedUrl.host+match[1];
    } else {
        // this should never happen
        // means we reached the end of the soup.io
        log.warn("Didn't find next url, assumed we reached the end of soup.io");

        return undefined;
    }
}

crawlBack ();
