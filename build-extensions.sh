#!/usr/bin/env bash
echo "Building extensions.."

version="4.1.4"

zip -r ./docs/dist/ainspector-firefox-$version.zip extension-firefox  -x ".*" -x "__MACOSX"
zip -r ./docs/dist/ainspector-chrome-$version.zip  extension-chrome   -x ".*" -x "__MACOSX"
zip -r ./docs/dist/ainspector-edge-$version.zip    extension-edge     -x ".*" -x "__MACOSX"
# zip -r ./docs/dist/ainspector-opera-$version.zip   extension-opera    -x ".*" -x "__MACOSX"
crx3 extension-opera -p ../pem/opera-ainspector.pem -o ./docs/dist/ainspector-opera-$version.crx

