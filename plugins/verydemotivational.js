var mag = require('../lib/magnetlib'),
    sys = require('sys'),
    url = require('url');

var log = new logger.Logger({
  logfile: "./log/magnets.log",
  loglevel: "info",
  logstdout: true,
  color: true
});

/// main page for crawling live streams
var MAIN="http://verydemotivational.com/";
exports.LIVE =  MAIN;

/// begin of crawling for crawling backwards
exports.BACKWARDS = MAIN;
exports.NAME = "verydemotivational.com plugin";

/** 
  * convenience function which exectues a regular expression and saves
  * every match in a table
  *
  * @author     makefu
  * @date       2010-10-11    
  * @param         regex the regular expression object
  * @param         content the string to validate the regex against
  * @return        an array of all matches
  */
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
 *
 * @param content of webpage
 * @return array of urls
 */ 

exports.getImages = function getImages(content) { 
  content = content.data;
  var imageFilter = /<img src=["'](\S+)["'] alt="[\s\S]+" title="[\s\S]*">/g;
  var images = new Array();

  images  = getMatches(imageFilter, content);
  return images;
}


/* @brief returns the next URL to parse backwards
 *
 * The next url should be the link to the 'next' page in the timeline
 * @param the content of the page
 * @return the url string 
 */
exports.getNextUrl = function getNextUrl(content) {
    var urlPattern = /<a href="(\S+)"\s*>Next/
    var match = urlPattern.exec(content.data)
    if(match != null && match != undefined) {
        var parsedUrl = url.parse(content.url);
        var front =match[1]
        log.debug("next url is: "+ front);
        return front
    } else {
        // this should never happen
        // means we reached the end of the soup.io
        log.warn("Didn't find next url, assumed we reached the end of verydemotivational");
        return undefined;
    }
};
