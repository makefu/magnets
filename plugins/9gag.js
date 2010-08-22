/*
 * magnets.js module for http://9gag.com
 */

var MAIN = "http://9gag.com/"

exports.LIVE = MAIN;

/// begin of crawling for crawling backwards
exports.BACKWARDS = MAIN;
exports.NAME = "9gag Plugin"

/* returns all funny pictures from 9gag frontpage
 *
 * @param content of webpage
 * @return array of urls
 */
exports.getImages = function getImages(content) { 
    return [];
};

/* returns the next URL to parse backwards
 *
 * The next url should be the link to the 'next' page in the timeline
 * @param the content of the page
 * @return the url string 
 */

exports.getNextUrl = function getNextUrl(content) {
  return MAIN;
};
