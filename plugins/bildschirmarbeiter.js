var mag = require('../lib/magnetlib'),
    sys = require('sys');


exports.createPlugin = function (log) {
    var out = {} ;
    out.MAIN="http://www.bildschirmarbeiter.com/pics/all/";
    out.LIVE =  undefined;

    /// begin of crawling for crawling backwards
    /// TODO currently you need to find the 
    ///      latest article via www.bildschirmarbeiter.com/pics/all and get the
    ///      first link, this needs to be changed and done automagically
    out.BACKWARDS = "http://www.bildschirmarbeiter.com/pic/bildschirmarbeiter_-_picdump_08.10.2010/";

    out.NAME = "Bildschirmarbeiter.com plugin";

    /** @brief returns all funny picture from given http-source
     *
     * refactored by makefu 
     *
     * @param content of webpage
     * @return array of urls or undefined if no pic found
     */ 

    out.getImages = function (content) { 
      var imageFilter = /<img class="image" id="pic\d+" src="(\S+)" width="\d+" height="\d+" alt/g
      var images = mag.getMatches(imageFilter, content.data)
      return images;
    }


    /** @brief returns the next URL to parse backwards
     *
     * The next url should be the link to the 'next' page in the timeline
     *
     * @param the content of the page
     * @return the url string 
     */
    out.getNextUrl = function (content) {
        var urlPattern = /<p class="fleft"><a href="(\S+)">/
        return urlPattern.exec(content.data)
    };
    return out;
};
