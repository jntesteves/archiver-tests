const fs = require('fs')
const { spawn } = require('child_process')
const zipStream = require('zip-stream')
const { queue } = require('async')

const archive = zipStream()
archive.pipe(fs.createWriteStream('./spawn-zip-stream-queue.zip'))

const q = queue(({ source, data }, callback) => {
  console.log(`source.readableFlowing ${source.readableFlowing}`)
  archive.entry(source, data, callback)
}, 1)

for (let i = 0; i < 10; ++i) {
  const child = spawn('dir', [], {
    shell: true,
    stdio: ['ignore', 'pipe', 'ignore']
  })

  q.push({ source: child.stdout, data: { name: 'test' + i + '.txt' } })
}

q.drain(() => { archive.finalize() })
