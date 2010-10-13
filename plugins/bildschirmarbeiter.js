

var mag = require('../lib/magnetlib'),
    sys = require('sys'),
    url = require('url');

var log = new logger.Logger({
  logfile: "./log/magnets.log",
  loglevel: "debug",
  logstdout: true,
  color: true
});

/// main page for crawling live streams
/// TODO find a way to provide LIVE image stream
var MAIN="http://www.bildschirmarbeiter.com/pics/all/";
exports.LIVE =  undefined;

/// begin of crawling for crawling backwards
/// TODO currently you need to find the 
///      latest article via www.bildschirmarbeiter.com/pics/all and get the
///      first link, this needs to be changed and done automagically
exports.BACKWARDS = "http://www.bildschirmarbeiter.com/pic/bildschirmarbeiter_-_picdump_08.10.2010/";
exports.NAME = "Bildschirmarbeiter.com plugin";

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
  var imageFilter = /<img class="image" id="pic\d+" src="(\S+)" width="\d+" height="\d+" alt/g
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
    var urlPattern = /<p class="fleft"><a href="(\S+)">/
    var match = urlPattern.exec(content.data)
    if(match != null && match != undefined) {
        var parsedUrl = url.parse(content.url);
        var front =match[1]
        log.debug("next url is: "+ front);
        return front
    } else {
        // this should never happen
        // means we reached the end of the soup.io
        log.warn("Didn't find next url, assumed we reached the end of Bildschrimarbeiter");
        return undefined;
    }
};