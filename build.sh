#!/usr/bin/env bash

docker version

docker build -t jobsch .

docker images

docker run -it --rm --name jobsh -v "$PWD":/usr/src/app -w /usr/src/app node:11 node run.js 2