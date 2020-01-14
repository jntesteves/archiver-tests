# Experiments in breaking node-archiver
Disclaimer: these tests will download over 2GB of data.

## Usage
```shell
# install dependencies
npm install

# execute some tests
cd requests/

# zip-stream test. Should pass checksum validation... hopefully
time ./test.sh requests-zip-stream-big.js

# archiver test. Will fail... but who knows
time ./test.sh requests-archiver-big.js
```
