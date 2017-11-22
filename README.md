# @transclusion/request

For making observable requests in the browser and in Node.js.

```sh
npm install @transclusion/request --save
```

[![build status](https://img.shields.io/travis/transclusion/request/master.svg?style=flat-square)](https://travis-ci.org/transclusion/request)
[![npm version](https://img.shields.io/npm/v/@transclusion/request.svg?style=flat-square)](https://www.npmjs.com/package/@transclusion/request)

## Usage

```js
import request from '@transclusion/request'

const subscription = request.get('https://www.google.com').subscribe({
  next(res) {
    switch (res.readyState) {
      case 3:
        console.log(`Loaded: ${res.bytesLoaded / res.bytesTotal * 100}%`)
        break
      case 4:
        console.log(`Text: ${res.text}`)
        break
    }
  },
  error(err) {
    console.error(err.stack)
  },
  complete() {
    console.log('DONE')
  }
})

// To abort the request at any time, simply unsubscribe:
subscription.unsubscribe()
```

## License

MIT © [Marius Lundgård](https://mariuslundgard.com)
