const fs = require('fs')
const r = require('request')
const zlib = require('zlib')
const zipStream = require('zip-stream')

const output = fs.createWriteStream('./request-zip-stream.zip')
const archive = zipStream()

const request = r({
  method: 'GET',
  uri: 'https://4.bp.blogspot.com/-jT50buLTo8M/U6Ray3egZEI/AAAAAAAABoY/VWKmka_LTZA/s1600/1.jpg'
})

archive.pipe(output)

request.on('response', response => {
  if (response.headers['content-encoding'] === 'gzip') {
    response = response.pipe(zlib.createGunzip())
  }

  archive.entry(response, { name: 'db.jpg' }, () => {
    archive.finalize()
  })
})
