var mag = require('./magnets')
var sys = require('sys')

function crawlerfunct(content) {
  var images = getImages(content);
  mag.downloadImages(images);
}

function getImages(content) {
  content = content.data;
  var imageFilter = /<img .* src=['"]{1}([\S]*)['"]{1}\s?(.*)\/>/g;
  var refFilter = /<a.*href=['"]{1}([\S]*)['"]{1}\s?class="lightbox"(.*)?>/g
  var images = new Array();

  var match;
  //TODO: REFACTOR ME!
  while (match = imageFilter.exec(content)) {
    if(match != null && match != undefined) {
        images.push(match[1]);
    }
  }
  while (match = refFilter.exec(content)) {
    if(match != null && match != undefined) {
      images.push(match[1]);
    }
  }
  return images;
} 
sys.puts("Start crawling")
var crawlUrl = "http://www.soup.io/everyone"
mag.httpGet({url: crawlUrl, data: ''}, crawlerfunct, "utf8")
