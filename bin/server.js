#!/usr/bin/env node
const Path = require('path')

const config = require('rc')('tars', {
  webhook: {
    path: '/webhook',
    secret: '(╯°□°）╯︵TABLEFLIP',
    port: 7777
  },
  release: {
    dir: Path.join(process.cwd(), 'release'),
    branch: 'gh-pages', // Restrict releases to tags on the specified branch
    stdout: process.stdout,
    stderr: process.stderr
  }
})

const createWebhook = require('../webhook')

const webhook = createWebhook(config, () => {
  console.log('Webhook server running on %j', webhook.server.address())
})
