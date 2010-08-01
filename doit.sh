#!/bin/bash
trap 'pkill node; exit 0' SIGINT 
node magnets.js&
tail -f log/magnets.log

