#!/usr/bin/env bash
PORT=$1
METEOR_PACKAGE_DIRS=../ meteor test-packages ./ --driver-package cultofcoders:mocha --port=${PORT}