import * as http from 'http'
import {parse as parseUrl} from 'url'

import {IHeaders, IOpts, IResponseObserver} from './types'

function createRequestObservable(method: string, url: string, opts: IOpts = {}) {
  let req: any = null

  return {
    method,
    url,

    subscribe(observer: IResponseObserver) {
      const urlInfo = parseUrl(url)
      const params = {
        method,
        protocol: urlInfo.protocol,
        host: urlInfo.hostname,
        port: urlInfo.port,
        path: urlInfo.path
      }

      let text: string = ''

      req = http.request(params, res => {
        res.on('data', buf => {
          text += buf.toString()
        })

        res.on('error', () => {
          if (observer.error) {
            observer.error(new Error('Something went wrong'))
          }
          if (observer.complete) {
            observer.complete()
          }
        })

        res.on('abort', () => {
          if (observer.complete) {
            observer.complete()
          }
        })

        res.on('end', () => {
          observer.next({
            readyState: 4,
            headers: Object.keys(res.headers).reduce(
              (headers, key) => {
                const val = res.headers[key]

                if (typeof val === 'string') {
                  headers[key] = val
                } else if (val instanceof Array) {
                  headers[key] = val.join(' ')
                }

                return headers
              },
              {} as IHeaders
            ),
            status: res.statusCode || 0,
            text,
            bytesTotal: text.length,
            bytesLoaded: text.length
          })
          if (observer.complete) {
            observer.complete()
          }
        })
      })

      req.end()

      return {
        unsubscribe() {
          // TODO: dispose
        }
      }
    }
  }
}

function get(url: string, opts: IOpts) {
  return createRequestObservable('GET', url, opts)
}

function post(url: string, opts: IOpts) {
  return createRequestObservable('POST', url, opts)
}

function put(url: string, opts: IOpts) {
  return createRequestObservable('PUT', url, opts)
}

function head(url: string, opts: IOpts) {
  return createRequestObservable('HEAD', url, opts)
}

function del(url: string, opts: IOpts) {
  return createRequestObservable('DELETE', url, opts)
}

function options(url: string, opts: IOpts) {
  return createRequestObservable('OPTIONS', url, opts)
}

function trace(url: string, opts: IOpts) {
  return createRequestObservable('TRACE', url, opts)
}

function copy(url: string, opts: IOpts) {
  return createRequestObservable('COPY', url, opts)
}

function lock(url: string, opts: IOpts) {
  return createRequestObservable('LOCK', url, opts)
}

function mkcol(url: string, opts: IOpts) {
  return createRequestObservable('MKCOL', url, opts)
}

function move(url: string, opts: IOpts) {
  return createRequestObservable('MOVE', url, opts)
}

function purge(url: string, opts: IOpts) {
  return createRequestObservable('PURGE', url, opts)
}

function propfind(url: string, opts: IOpts) {
  return createRequestObservable('PROPFIND', url, opts)
}

function proppatch(url: string, opts: IOpts) {
  return createRequestObservable('PROPPATCH', url, opts)
}

function unlock(url: string, opts: IOpts) {
  return createRequestObservable('UNLOCK', url, opts)
}

function report(url: string, opts: IOpts) {
  return createRequestObservable('REPORT', url, opts)
}

function mkactivity(url: string, opts: IOpts) {
  return createRequestObservable('MKACTIVITY', url, opts)
}

function checkout(url: string, opts: IOpts) {
  return createRequestObservable('CHECKOUT', url, opts)
}

function merge(url: string, opts: IOpts) {
  return createRequestObservable('MERGE', url, opts)
}

function mSearch(url: string, opts: IOpts) {
  return createRequestObservable('M-SEARCH', url, opts)
}

function notify(url: string, opts: IOpts) {
  return createRequestObservable('NOTIFY', url, opts)
}

function subscribe(url: string, opts: IOpts) {
  return createRequestObservable('SUBSCRIBE', url, opts)
}

function unsubscribe(url: string, opts: IOpts) {
  return createRequestObservable('UNSUBSCRIBE', url, opts)
}

function patch(url: string, opts: IOpts) {
  return createRequestObservable('PATCH', url, opts)
}

function search(url: string, opts: IOpts) {
  return createRequestObservable('SEARCH', url, opts)
}

function connect(url: string, opts: IOpts) {
  return createRequestObservable('CONNECT', url, opts)
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
