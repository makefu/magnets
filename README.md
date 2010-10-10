FUCKING MAGNETS HOW DO THEY WORK?
---------------------------------

This project is designed to be a modular image grabber/crawler written in node.js.

It's main purpose is derived from this XKCD quote:

> With the collapse of the dollar the government has endorsed an alternate currency.
> Your monetary worth is now determined by the number of funny pictures savedto your hard drive.

[Quote from XKCD](http://xkcd.com/512/)

The name was borrowed from [the 'fucking magnets' meme](http://knowyourmeme.com/memes/f-cking-magnets-how-do-they-work).

Used node.js libraries:
=======================
  
  * [Trollopjs for commandline parsing](http://github.com/bentomas/trollopjs)
  * [Node-Streamlogger for logging](http://github.com/andrewvc/node-streamlogger)
  * [Node-Htmlparser for logging](http://github.com/tautologistics/node-htmlparser)
  * [Colored.js for colored VT100 output](http://github.com/pfleidi/colored.js)

TODO:
=====

  * Live Ticker (scheduler) - partly implemented
  * Other Plugins
  * Backwards grabbing
  * Add debugging and inspection howto
  * Support commandline options like loglevel 
  * Use node-htmlparser instead of own regex


Workaround to delete downloaded html files:
===========================================

        for i in *; do file $i; done  | grep HTML | awk '{print $1}' | sed -e 's/://' | xargs rm -v
