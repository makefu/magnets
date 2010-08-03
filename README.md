FUCKING MAGNETS HOW DO THEY WORK?
---------------------------------

This project is designed to be a modular image grabber/crawler written in node.js.

It's main purpose is derived from this XKCD quote:

> With the collapse of the dollar the government has endorsed an alternate currency.
> Your monetary worth is now determined by the number of funny pictures savedto your hard drive.

[Quote from XKCD](http://xkcd.com/512/)

The name is was borrowed from [the 'fucking magnets' meme](http://knowyourmeme.com/memes/f-cking-magnets-how-do-they-work).

Used node.js libraries:
=======================
  
  * [http://github.com/bentomas/trollopjs](Trollopjs for commandline parsing)
  * [http://github.com/andrewvc/node-streamlogger](Node-Streamlogger for logging)

TODO:
=====

  * Live Ticker ( scheduler )
  * Other Plugins
  * Backwards grabbing
  * Add debugging and inspection howto
  * Support commandline options like loglevel 


Workaround to delete downloaded html files:
===========================================

        for i in *; do file $i; done  | grep HTML | awk '{print $1}' | sed -e 's/://' | xargs rm -v
