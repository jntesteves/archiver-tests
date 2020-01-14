const fs = require('fs')
const r = require('request')
const zlib = require('zlib')
const archiver = require('archiver')

const output = fs.createWriteStream('./request-archiver.zip')

const archive = archiver('zip', {
  store: true
})

const request = r({
  method: 'GET',
  uri: 'https://4.bp.blogspot.com/-jT50buLTo8M/U6Ray3egZEI/AAAAAAAABoY/VWKmka_LTZA/s1600/1.jpg'
})

archive.pipe(output)

request.on('response', response => {
  if (response.headers['content-encoding'] === 'gzip') {
    response = response.pipe(zlib.createGunzip())
  }

  archive.append(response, { name: 'db.jpg' })
  archive.finalize()
})
