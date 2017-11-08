const execFile = require('./exec-file')

const Git = {
  checkout (cwd, commit, opts, cb) {
    execFile('git', ['checkout', commit], cwd, opts, (err) => cb(err))
  },

  pull (cwd, remote, branch, opts, cb) {
    const args = ['pull', remote, branch]
    if (opts.tags) args.push('--tags')
    execFile('git', args, cwd, opts, (err) => cb(err))
  },

  clone (cwd, repo, opts, cb) {
    const args = ['clone', repo]
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
  const args = ['branch', '--contains', commit, '--all']

  execFile('git', args, cwd, opts, (err, stdout) => {
    if (err) return cb(err)

    const branches = stdout.toString().trim().split('\n').map((branch) => {
      return branch.trim().replace(/[\s*]/g, '')
    })

    let contains = branches.indexOf(branch) > -1
    contains = contains || branches.indexOf(`remotes/origin/${branch}`) > -1

    cb(null, contains)
  })
}

module.exports = Git
