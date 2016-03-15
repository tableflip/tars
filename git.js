const execFile = require('./exec-file')

const Git = {
  checkout (cwd, commit, opts, cb) {
    execFile('git', ['checkout', commit], cwd, opts, (err) => cb(err))
  },

  pull (cwd, remote, branch, opts, cb) {
    var args = ['pull', remote, branch]
    if (opts.tags) args.push('--tags')
    execFile('git', args, cwd, opts, (err) => cb(err))
  },

  clone (cwd, repo, opts, cb) {
    var args = ['clone', repo]
    if (opts.cloneDir) args.push(opts.cloneDir)
    execFile('git', args, cwd, opts, (err) => cb(err))
  },

  branch () {
    throw new Error('Not implemented')
  }
}

Git.branch.contains = () => {
  throw new Error('Not implemented')
}

Git.branch.contains.all = (cwd, branch, commit, opts, cb) => {
  var args = ['branch', '--contains', commit, '--all']

  execFile('git', args, cwd, opts, (err, stdout) => {
    if (err) return cb(err)

    var branches = stdout.toString().trim().split('\n').map((branch) => {
      return branch.trim().replace(/[\s\*]/g, '')
    })

    var contains = branches.indexOf(branch) > -1
    contains = contains || branches.indexOf(`remotes/origin/${branch}`) > -1

    cb(null, contains)
  })
}

module.exports = Git
