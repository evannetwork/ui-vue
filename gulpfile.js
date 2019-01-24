const gulp = require('gulp')
const os = require('os')
const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn

// all the optional gulp targets

try { require('./gulp/compile-contracts.js') }
catch (e) { if (e.code !== "MODULE_NOT_FOUND") throw e; }

try { require('./gulp/create-profiles.js') }
catch (e) { if (e.code !== "MODULE_NOT_FOUND") throw e; }

try { require('./gulp/smart-agents.js') }
catch (e) { if (e.code !== "MODULE_NOT_FOUND") throw e; }

try { require('./gulp/dapps.js') }
catch (e) { if (e.code !== "MODULE_NOT_FOUND") throw e; }

// needed for the targets that are always available
const evan = require('./scripts/evan.access.js')

gulp.task('test', () => { console.log('your tests') })

// upload files encrypted with default account
gulp.task('upload', () => {
  const files = []
  return evan.upload(files)()
})
// upload files unencrypted
gulp.task('publish', async () => {
  const files = []
  gulp.src('descriptions/*.json', {buffer: false})
    .on('data', d => files.push(d.history[0]) )
  return evan.upload(files)()
})

gulp.task('download', evan.download() )


