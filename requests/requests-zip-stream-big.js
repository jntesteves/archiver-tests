const fs = require('fs')
const request = require('request')
const zlib = require('zlib')
const zipStream = require('zip-stream')
const { promisify } = require('util')

const output = fs.createWriteStream('./out.zip')

const archive = zipStream({
  zlib: { level: 9 }
})

const entry = promisify(archive.entry).bind(archive)
archive.pipe(output)

const uris = [
  'https://cloud-images.ubuntu.com/eoan/20200114/SHA256SUMS',
  'https://cloud-images.ubuntu.com/eoan/20200114/eoan-server-cloudimg-amd64.img',
  'https://cloud-images.ubuntu.com/eoan/20200114/eoan-server-cloudimg-amd64-disk-kvm.img',
  'https://cloud-images.ubuntu.com/eoan/20200114/eoan-server-cloudimg-amd64.squashfs',
  'https://cloud-images.ubuntu.com/eoan/20200114/eoan-server-cloudimg-amd64.tar.gz',
  'https://cloud-images.ubuntu.com/eoan/20200114/eoan-server-cloudimg-amd64-root.tar.xz'
]

uris.reduce((sequence, uri, i) => {
  return sequence.then(() => {
    return get(uri).then(({ uri, stream }) => {
      console.log(`appending stream: ${uri}`)
      return entry(stream, { name: uri.slice(46) })
    })
  })
}, Promise.resolve()).then(() => {
  console.log('finalizing archive')
  archive.finalize()
})

async function get (uri) {
  return new Promise((resolve, reject) => {
    const req = request({
      method: 'GET',
      uri
    })

    // TODO: reject on failure

    req.on('response', response => {
      if (response.headers['content-encoding'] === 'gzip') {
        response = response.pipe(zlib.createGunzip())
      }

      resolve({
        uri,
        stream: response
      })
    })
  })
}
