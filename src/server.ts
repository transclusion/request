import * as http from 'http'
import * as https from 'https'
import {parse as parseUrl} from 'url'

import {IHeaders, IOpts, IResponseObserver, Response} from './types'

function parseHeaders (rawHeaders: any) {
  return Object.keys(rawHeaders).reduce(
    (headers, key) => {
      const lowerCaseKey = key.toLowerCase()
      const val = rawHeaders[key]

      if (typeof val === 'string') {
        headers[lowerCaseKey] = val
      } else if (val instanceof Array) {
        headers[lowerCaseKey] = val.join(' ')
      }

      return headers
    },
    {} as IHeaders
  )
}

function request(method: string, url: string, opts: IOpts = {}) {
  let req: any = null
  let headers: IHeaders

  return {
    subscribe(observer: IResponseObserver) {
      const urlInfo = parseUrl(url)
      const protocol = urlInfo.protocol
      const transport: any = protocol === 'https:' ? https : http
      const params = {
        method,
        host: urlInfo.hostname,
        port: urlInfo.port,
        path: urlInfo.path
      }

      let text: string = ''
      let isComplete = false

      function handleNext (res: Response) {
        if (!isComplete) {
          observer.next(res)
        }
      }

      function handleError (err: Error) {
        if (observer.error) {
          observer.error(err)
        }

        handleComplete()
      }

      function handleComplete () {
        if (observer.complete) {
          observer.complete()
          isComplete = true
        }
      }

      req = transport.request(params, (res: any) => {
        res.on('data', (buf: Buffer) => {
          headers = headers || parseHeaders(res.headers)

          text += buf.toString()

          handleNext({
            readyState: 3,
            headers,
            bytesLoaded: text.length,
            bytesTotal: Number(headers['content-length'] || -1),
            status: res.statusCode || 0
          })
        })

        res.on('error', () => {
          handleError(new Error('Something went wrong'))
        })

        res.on('abort', () => {
          handleComplete()
        })

        res.on('end', () => {
          handleNext({
            readyState: 4,
            headers: headers || parseHeaders(res.headers),
            status: res.statusCode || 0,
            text,
            bytesTotal: Buffer.byteLength(text, 'utf8'),
            bytesLoaded: Buffer.byteLength(text, 'utf8')
          })
          handleComplete()
        })
      })

      req.end()

      return {
        unsubscribe() {
          handleComplete()
          req.abort()
        }
      }
    }
  }
}

function get(url: string, opts: IOpts) {
  return request('GET', url, opts)
}

function post(url: string, opts: IOpts) {
  return request('POST', url, opts)
}

function put(url: string, opts: IOpts) {
  return request('PUT', url, opts)
}

function head(url: string, opts: IOpts) {
  return request('HEAD', url, opts)
}

function del(url: string, opts: IOpts) {
  return request('DELETE', url, opts)
}

function options(url: string, opts: IOpts) {
  return request('OPTIONS', url, opts)
}

function trace(url: string, opts: IOpts) {
  return request('TRACE', url, opts)
}

function copy(url: string, opts: IOpts) {
  return request('COPY', url, opts)
}

function lock(url: string, opts: IOpts) {
  return request('LOCK', url, opts)
}

function mkcol(url: string, opts: IOpts) {
  return request('MKCOL', url, opts)
}

function move(url: string, opts: IOpts) {
  return request('MOVE', url, opts)
}

function purge(url: string, opts: IOpts) {
  return request('PURGE', url, opts)
}

function propfind(url: string, opts: IOpts) {
  return request('PROPFIND', url, opts)
}

function proppatch(url: string, opts: IOpts) {
  return request('PROPPATCH', url, opts)
}

function unlock(url: string, opts: IOpts) {
  return request('UNLOCK', url, opts)
}

function report(url: string, opts: IOpts) {
  return request('REPORT', url, opts)
}

function mkactivity(url: string, opts: IOpts) {
  return request('MKACTIVITY', url, opts)
}

function checkout(url: string, opts: IOpts) {
  return request('CHECKOUT', url, opts)
}

function merge(url: string, opts: IOpts) {
  return request('MERGE', url, opts)
}

function mSearch(url: string, opts: IOpts) {
  return request('M-SEARCH', url, opts)
}

function notify(url: string, opts: IOpts) {
  return request('NOTIFY', url, opts)
}

function subscribe(url: string, opts: IOpts) {
  return request('SUBSCRIBE', url, opts)
}

function unsubscribe(url: string, opts: IOpts) {
  return request('UNSUBSCRIBE', url, opts)
}

function patch(url: string, opts: IOpts) {
  return request('PATCH', url, opts)
}

function search(url: string, opts: IOpts) {
  return request('SEARCH', url, opts)
}

function connect(url: string, opts: IOpts) {
  return request('CONNECT', url, opts)
}

export {
  get,
  post,
  put,
  head,
  del,
  options,
  trace,
  copy,
  lock,
  mkcol,
  move,
  purge,
  propfind,
  proppatch,
  unlock,
  report,
  mkactivity,
  checkout,
  merge,
  mSearch,
  notify,
  subscribe,
  unsubscribe,
  patch,
  search,
  connect
}

export default {
  get,
  post,
  put,
  head,
  del,
  options,
  trace,
  copy,
  lock,
  mkcol,
  move,
  purge,
  propfind,
  proppatch,
  unlock,
  report,
  mkactivity,
  checkout,
  merge,
  mSearch,
  notify,
  subscribe,
  unsubscribe,
  patch,
  search,
  connect
}
