FUCKING MAGNETS HOW DO THEY WORK?
=================================

This project is designed to be a modular image grabber/crawler written in node.js.

It's main purpose is derived from this XKCD quote:

> With the collapse of the dollar the government has endorsed an alternate currency.
> Your monetary worth is now determined by the number of funny pictures savedto your hard drive.

[Quote from XKCD](http://xkcd.com/512/)

The name was borrowed from [the 'fucking magnets' meme](http://knowyourmeme.com/memes/f-cking-magnets-how-do-they-work).


FEATURES
--------

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
-----

  * Live Ticker (scheduler) - partly implemented
  * Other Plugins (recently added cheezburger network)
  * Add debugging and inspection howto
  * Support commandline options like loglevel  (partly implemented)
  * Use node-htmlparser instead of own regex (used in cheezburger as first plugin)
  * meta data for every picture

Used node.js libraries:
-----------------------
  
  * [log4js-node for logging](http://github.com/csausdev/log4js-node)
  * [optimist for commandline parsing](http://github.com/csausdev/log4js-node)
  * [Node-Htmlparser for Screen Scraping](http://github.com/tautologistics/node-htmlparser)
  * [soupselect for CSS selectors after HTML-parsing](http://github.com/harryf/node-soupselect.git)
  * [node-wwwdude for http-connections](http://github.com/pfleidi/node-wwwdude.git)
  * [mongodb to persist meta data](http://mongodb.org/)
  * [mongoose as convenience wrapper for mongodb-native](https://github.com/LearnBoost/mongoose/)

in short:
npm install htmlparser soupselect log4js wwwdude optimist mongoose
