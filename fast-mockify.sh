#!/usr/bin/env bash

set -e

declare -r DIR="$(pwd)"
declare -r swagger_file="./survv-api.yaml"
declare -r WIREMOCK_IP_FILE="./local_wiremock"
declare -r docker_image=$(docker ps -aq -f name=local-wiremock)

curl -o ${swagger_file} https://storage.googleapis.com/survv-build-assets/survv-api.yaml

if [[ ! -z "$docker_image" ]]; then
  echo "deleting existing local-wiremock container"
  docker rm -f local-wiremock
fi

echo "creating local-wiremock container"

docker run \
	--name local-wiremock \
	--detach \
	--hostname wiremock \
	--volume $DIR:/shared \
	--publish 80:8080 \
	virgingates/validating-wiremock \
	"--openapi-file=/shared/survv-api.yaml"


docker network inspect bridge | jq .[].IPAM.Config[0].Gateway | tr -d '"' > $WIREMOCK_IP_FILE
