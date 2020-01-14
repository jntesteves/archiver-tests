const fs = require('fs')
const { spawn } = require('child_process')
const archiver = require('archiver')

const archive = archiver('zip')
archive.pipe(fs.createWriteStream('./spawn-archiver.zip'))

for (let i = 0; i < 10; ++i) {
  const child = spawn('dir', [], {
    shell: true,
    stdio: ['ignore', 'pipe', 'ignore']
  })

  archive.append(child.stdout, { name: 'test' + i + '.txt' })
}

archive.finalize()
