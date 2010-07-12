// sample plugin
//

var MAIN = "http://example.org/"

/// main page for crawling live streams

global.LIVE=  MAIN

/// begin of crawling for crawling backwards
global.BACKWARDS = MAIN 


/* @brief returns all funny picture from given http-source
 *
 * this function should return an array of picture urls to be downloaded
 * from a given http Content
 * @param content of webpage
 * @return array of urls
 */
global.getImages = function getImages(content) { 
    return new Array();
};

/* @brief returns the next URL to parse backwards
 *
 * The next url should be the link to the 'next' page in the timeline
 * @param the content of the page
 * @return the url string 
 */
global.getNextUrl = function getNextUrl(content) {
};
