#!/bin/sh
cd $(dirname $(readlink -f $0))
echo "using $image_folder "
exec node magnets.js
