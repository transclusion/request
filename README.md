# @transclusion/request

A minimal xhr-based library for making _observable_ requests in the browser and in Node.js.

```sh
# Install with npm
npm install @transclusion/request

# Install with yarn
yarn add @transclusion/request
```

[![build status](https://img.shields.io/travis/transclusion/request/master.svg?style=flat-square)](https://travis-ci.org/transclusion/request)
[![npm version](https://img.shields.io/npm/v/@transclusion/request.svg?style=flat-square)](https://www.npmjs.com/package/@transclusion/request)

## Usage

```js
import {get} from '@transclusion/request'

// Make a request observable
const req = get('https://www.google.com')

// The request will be sent whenever it is subscribed to
const subscription = req.subscribe({
  next(res) {
    if (res.readyState === 3) {
      console.log(`Loaded: ${(res.bytesLoaded / res.bytesTotal) * 100}%`)
    }

    if (res.readyState === 4) {
      console.log(`Text: ${res.text}`)
    }
  },
  error(err) {
    console.error(err.stack)
  },
  complete() {
    console.log('DONE')
  },
})

// To abort the request at any time, simply unsubscribe:
subscription.unsubscribe()
```

## License

MIT © [Marius Lundgård](https://mariuslundgard.com)
