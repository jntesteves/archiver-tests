#!/bin/sh

if [ -z "$1" ]; then
  echo 'You must inform a script to execute. For example:'
  echo './test.sh requests-zip-stream-big.js'
  exit 1
fi

rm -rf ./output
mkdir ./output || exit
node $1 || exit
echo
unzip ./out.zip -d ./output || exit
cd ./output/
echo
echo 'Verifying checksums'
sha256sum -c --ignore-missing SHA256SUMS
echo
cd -
