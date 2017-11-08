const test = require('tape')
const release = require('../release')

test('Should successfully release', (t) => {
  t.plan(1)

  const repo = 'git@github.com:alanshaw/tableflip-www.git'
  const tag = 'TEST001'
  const opts = {branch: 'gh-pages', stdout: process.stdout, stderr: process.stderr}

  release(repo, tag, opts, (err) => {
    t.ifError(err, 'No error building')
    t.end()
  })
})
