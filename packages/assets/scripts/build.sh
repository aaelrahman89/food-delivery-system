#!/usr/bin/env sh
THIS_DIR=./$(dirname "$0")
PACKAGE_DIR=$(realpath "$THIS_DIR/../")

mkdir -p "$PACKAGE_DIR"/public/images/map-markers

for FILE_PATH in "$PACKAGE_DIR"/src/map-icons-source/*.png; do
  _file_name=$(basename $FILE_PATH)
  convert "$FILE_PATH" -resize 30x30 "$PACKAGE_DIR"/public/images/map-markers/"${_file_name%.*}"-30.png;
done
