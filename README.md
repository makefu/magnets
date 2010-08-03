FUCKING MAGNETS HOW DO THEY WORK?
---------------------------------

> With the collapse of the dollar the government has endorsed an alternate currency.
> Your monetary worth is now determined by the number of funny pictures savedto your hard drive.

[Quote from XKCD](http://xkcd.com/512/)

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
