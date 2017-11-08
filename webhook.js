const Http = require('http')
const createHandler = require('github-webhook-handler')
const release = require('./release')

module.exports = (opts, cb) => {
  const handler = createHandler(opts.webhook)

  const server = Http.createServer((req, res) => {
    handler(req, res, (err) => {
      if (err) console.error(err)
      res.statusCode = 404
      res.end('no such location')
    })
  }).listen(opts.webhook.port, cb)

  handler.on('error', (err) => console.error('Webhook handler error', err))

  // https://developer.github.com/v3/activity/events/types/#createevent
  handler.on('create', (event) => {
    const tag = event.payload.ref
    const repo = event.payload.repository

    if (!tag || !repo) {
      return console.warn('Ignoring unexpected create payload', event.payload)
    }

    const name = `${repo.ssh_url} @ ${tag}`

    if (event.payload.ref_type !== 'tag') {
      return console.log(`Ignoring ${event.payload.ref_type} create event on ${name}`)
    }

    console.log(`Releasing ${name}`)

    release(repo.ssh_url, tag, opts.release, (err) => {
      if (err) return console.error(`Failed to release ${name}`, err)
      console.log(`Successfully released ${name}`)
    })
  })

  return {server, handler}
}
