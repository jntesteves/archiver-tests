const fs = require('fs')
const { spawn } = require('child_process')
const zipStream = require('zip-stream')
const { promisify } = require('util')

const archive = zipStream()
const entry = promisify(archive.entry).bind(archive)
archive.pipe(fs.createWriteStream('./spawn-zip-stream-promise.zip'))

;[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reduce((sequence, i) => {
  const child = spawn('dir', [], {
    shell: true,
    stdio: ['ignore', 'pipe', 'ignore']
  })

  return sequence.then(() => {
    return entry(child.stdout, { name: 'test' + i + '.txt' })
  })
}, Promise.resolve()).then(() => {
  archive.finalize()
})
