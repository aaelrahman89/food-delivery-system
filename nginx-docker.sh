#!/bin/sh

DIR="$(pwd)"

npm run bundle

docker build -t survv-fe-c-web:local -f "${DIR}/Dockerfile" "${DIR}"

docker run \
	--name survv-fe-c-web-local \
	--detach \
	--hostname survv-fe-c-web \
	--publish 5050:8080 \
	survv-fe-c-web:local
