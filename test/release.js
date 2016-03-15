const test = require('tape')
const release = require('../release')

test('Should successfully release', (t) => {
  t.plan(1)

  var repo = 'git@github.com:alanshaw/tableflip-www.git'
  var tag = 'TEST001'
  var opts = {branch: 'gh-pages', stdout: process.stdout, stderr: process.stderr}

  release(repo, tag, opts, (err) => {
    t.ifError(err, 'No error building')
    t.end()
  })
})
