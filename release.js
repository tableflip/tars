const Path = require('path')
const Fs = require('fs')
const mkdirp = require('mkdirp')
const Async = require('async')
const parse = require('github-url')
const Git = require('./git')

module.exports = function release (repo, tag, opts, cb) {
  if (!cb) {
    cb = opts
    opts = {}
  }

  opts = opts || {}
  opts.dir = opts.dir || Path.join(process.cwd(), 'release')
  opts.branch = opts.branch || 'master'

  const urlInfo = parse(repo)
  const userDir = Path.join(opts.dir, urlInfo.user)
  const repoDir = Path.join(userDir, urlInfo.project)

  Async.waterfall([
    // Ensure user release dir exists
    (cb) => mkdirp(userDir, cb),
    // Determine if newly created or existing
    (made, cb) => Fs.access(repoDir, Fs.F_OK, (err) => cb(null, !err)),
    // Clone or pull the repo
    (exists, cb) => {
      if (exists) {
        Git.checkout(repoDir, opts.branch, opts, (err) => {
          if (err) return cb(err)
          const pullOpts = Object.assign({}, opts, {tags: true}) // Pull the tags also
          Git.pull(repoDir, 'origin', opts.branch, pullOpts, cb)
        })
      } else {
        Git.clone(userDir, repo, opts, cb)
      }
    },
    // Ensure tag is on the optional specified branch
    (cb) => {
      if (!opts.branch) return cb()

      Git.branch.contains.all(repoDir, opts.branch, tag, opts, (err, contains) => {
        if (err) return cb(err)
        if (!contains) return cb(new Error('Tag not on branch'))
        cb()
      })
    },
    // Checkout the tag
    (cb) => Git.checkout(repoDir, tag, opts, cb)
  ], (err) => {
    if (err) return cb(err)
    cb(err, {dir: repoDir})
  })
}
