# TARS

TABLEFLIP Automated Release System.

## Getting started

1. Install Node.js
2. Install dependencies `npm install`
3. (Optional) Add builder config file `.tarsrc` (defaults below):

    ```js
    {
      webhook: {
        path: '/webhook',
        secret: '(╯°□°）╯︵TABLEFLIP',
        port: 7777
      },
      release: {
        dir: './release',
        branch: 'gh-pages', // Restrict releases to tags on the specified branch
      }
    }
    ```
4. Start the webhook `npm start`

## Configure a site to be released

1. Navigate to **Settings** for the repo
2. In **Collaborators**, add `tableflip-tars` as a collaborator with **read** access
3. in **Webhooks & services** add a new webhook with the following info:
    * Payload URL: `http://tars.tableflip.io:7777/webhook`
    * Content type: `application/json`
    * Secret: **Retrieve from secrets.yaml for tars-infrastructure project**
    * Event: **Create** (Branch or tag created)

## Programmatic usage

**release.js**
```js
const release = require('./release')

const repo = 'git@github.com:tableflip/tableflip-www.git'
const tag = 'v1.0.1'
const opts = {stdout: process.stdout, stderr: process.stderr}

release(repo, tag, opts, (err, info) => {
  console.log(`Released in ${info.dir}`)
})
```
