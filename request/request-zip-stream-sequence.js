const fs = require('fs')
const request = require('request')
const zlib = require('zlib')
const zipStream = require('zip-stream')
const { promisify } = require('util')

const output = fs.createWriteStream('./request-zip-stream-sequence.zip')

const archive = zipStream({
  zlib: { level: 9 }
})

const entry = promisify(archive.entry).bind(archive)
archive.pipe(output)

const uris = [
  'http://anime.es/wp-content/uploads/2014/01/Anime-Dragon-Ball-50-0.jpg',
  'https://4.bp.blogspot.com/-jT50buLTo8M/U6Ray3egZEI/AAAAAAAABoY/VWKmka_LTZA/s1600/1.jpg',
  'https://i.ytimg.com/vi/xLLOHimYsM8/maxresdefault.jpg',
  'https://2.bp.blogspot.com/-SfKQJbm5l5g/UVSi6uyBy1I/AAAAAAAAAuc/BbRjzehBsUE/s1600/dragon+02.jpg',
  'http://bleumag.com/v2/wp-content/uploads/2018/08/Dragon-Ball-2.jpg',
  'https://upload.wikimedia.org/wikipedia/it/3/3f/Dragon_Ball_cover_1.jpg'
]

uris.reduce((sequence, uri, i) => {
  return sequence.then(() => {
    return get(uri).then(({ uri, stream }) => {
      console.log(`appending stream: ${uri}`)
      return entry(stream, { name: `db${i}.jpg` })
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
