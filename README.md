FUCKING MAGNETS HOW DO THEY WORK?
---------------------------------

This project is designed to be a modular image grabber/crawler written in node.js.

It's main purpose is derived from this XKCD quote:

> With the collapse of the dollar the government has endorsed an alternate currency.
> Your monetary worth is now determined by the number of funny pictures savedto your hard drive.

[Quote from XKCD](http://xkcd.com/512/)

The name was borrowed from [the 'fucking magnets' meme](http://knowyourmeme.com/memes/f-cking-magnets-how-do-they-work).

USAGE
=====

	npm install
	PORT=8080 image_folder=/data/images node magnets.js

FEATURES
=======
- download all the funny pictures on the internet directly to your hard disk
- extensible plugin facility with multi-module support
- modules for high-quality funny pics 
    - icanhascheezburger-network like failblog and lolcats
    - soup.io
    - kqe 
    - bildschirmarbeiter
    - ... more
- FUNNY PICTURES ALL THE WAY
TODO:
=====

  * Live Ticker (scheduler) - partly implemented
  * Other Plugins ( recently added cheezburger\_network)
  * Add debugging and inspection howto
  * Support commandline options like loglevel 
  * Use node-htmlparser instead of own regex (used in cheezburger as first
    plugin
  * meta data for every picture

Used node.js libraries:
=======================
  
  * [Trollopjs for commandline parsing](http://github.com/bentomas/trollopjs)
  * [Node-Streamlogger for logging](http://github.com/andrewvc/node-streamlogger)
  * [Node-Htmlparser for Screen Scraping](http://github.com/tautologistics/node-htmlparser)
  * [soupselect for CSS selectors after HTML-parsing](http://github.com/harryf/node-soupselect.git)
  * [Coloredjs for colored VT100 output](http://github.com/pfleidi/colored.js)
  * [node-wwwdude for http-connections](http://github.com/pfleidi/node-wwwdude.git)

in short:
npm install trollop htmlparser soupselect http://github.com/pfleidi/node-wwwdude/tarball/master 

Workaround to delete downloaded html files:
===========================================
This is not necessary  as wwwdude supports redirects!
For historic reasons -> $ for i in *; do file $i; done  | grep HTML | awk '{print $1}' | sed -e 's/://' | xargs rm -v
