#!/usr/bin/env bash
echo "Building extensions.."

version="4.2.0"

echo "
Building AInspector browser extenions

Creating Firefox extension zip file ...
"
cd extension-firefox
rm ../docs/dist/ainspector-firefox-$version.zip
zip -r ../docs/dist/ainspector-firefox-$version.zip . -x ".*" -x "__MACOSX"

echo "
Creating Edge extension zip file ...
"
cd ../extension-edge
rm ../docs/dist/ainspector-edge-$version.zip
zip -r ../docs/dist/ainspector-edge-$version.zip    . -x ".*" -x "__MACOSX"

echo "
Creating Chrome extension zip file ...
"
cd ../extension-chrome
rm ../docs/dist/ainspector-chrome-$version.zip
zip -r ../docs/dist/ainspector-chrome-$version.zip  . -x ".*" -x "__MACOSX"

echo "
Creating Opera extension crx file ...
"
cd ../extension-opera
crx3 . -p ../../pem/opera-ainspector.pem -o ../docs/dist/ainspector-opera-$version.crx

