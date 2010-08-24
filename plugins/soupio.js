
/// main page for crawling live streams

var mag = require('../lib/magnetlib'),
    sys = require('sys'),
    url = require('url');

var log = new logger.Logger({
  logfile: "./log/magnets.log",
  loglevel: "debug",
  logstdout: true
});

var MAIN="http://www.soup.io/everyone";
exports.LIVE =  MAIN;

/// begin of crawling for crawling backwards
exports.BACKWARDS = undefined;
exports.NAME = "Soup.io plugin";

/* @brief returns all funny picture from given http-source
 *
 * this function should return an array of picture urls to be downloaded
 * from a given http Content
 *
 * This function should ONLY return an array of the actual pictures.
 * That means, that on some pages ( e.g. 9gag) this function might do
 * autonomous http-requests for content-pages and parse the interesing
 * pictures from there.
 *
 * TODO think about how to collect picture urls after asynchronous http
 * requests!
 *
 *
 * @param content of webpage
 * @return array of urls
 */ 

exports.getImages = function getImages(content) { 
  content = content.data;
  var imageFilter = /<img .* src=['"]{1}([\S]*)['"]{1}\s?(.*)\/>/g;
  var refFilter = /<a .*href=['"]{1}([\S]*)['"]{1}\s?class="lightbox"(.*)>/g;
  var images = new Array();

  //TODO: REFACTOR ME!
  while (match = imageFilter.exec(content)) {
    if(match != null && match != undefined) {
      if( ! match[0].match(/-square/)) {
        log.debug("found: "+ match[0]);
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

/* @brief returns the next URL to parse backwards
 *
 * The next url should be the link to the 'next' page in the timeline
 * @param the content of the page
 * @return the url string 
 */
exports.getNextUrl = function getNextUrl(content) {
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
};
