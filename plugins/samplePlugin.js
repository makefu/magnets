var Mag = require('../lib/magnetlib');

exports.createPlugin = function (log) {
    var out = {};
    /// main page for crawling live streams
    var MAIN = "http://example.org/"
    /// begin of crawling for crawling backwards
    out.LIVE =  undefined;
    // replace with MAIN or whatever the link is
    out.BACKWARDS = undefined;
    out.NAME = "Sample Plugin";

    /** @brief returns all funny picture from given http-source
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
    out.getImages = function getImages(content) {
        var imageFilter = /regex to find images/g;
        return Mag.getMatches(imageFilter, content.data);
    };

    /** @brief returns the next URL to parse backwards
     *
     * The next url should be the link to the 'next' page in the timeline
     * @param the content of the page
     * @return the url string
     */
    out.getNextUrl = function getNextUrl(content) {
        var urlPattern = /regex to find the next url/
        return urlPattern.exec(content.data);
    };
    return [out];
};
