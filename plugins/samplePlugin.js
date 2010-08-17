// sample plugin
//

var MAIN = "http://example.org/"

/// main page for crawling live streams

exports.LIVE=  MAIN

/// begin of crawling for crawling backwards
exports.BACKWARDS = MAIN 
exports.NAME = "Sample Plugin"

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
    return new Array();
};

/* @brief returns the next URL to parse backwards
 *
 * The next url should be the link to the 'next' page in the timeline
 * @param the content of the page
 * @return the url string 
 */
exports.getNextUrl = function getNextUrl(content) {
  return MAIN;
};
