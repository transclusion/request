import {IHeaders, IOpts, IResponseObserver} from './types'

function createRequestObservable(method: string, url: string, opts: IOpts = {}) {
  const async = opts.async || true

  let req: any = null

  return {
    method,
    url,
    subscribe(observer: IResponseObserver) {
      const xhr = (req = new XMLHttpRequest())

      let status = 0
      let headers: IHeaders = {}
      let bytesTotal = -1
      let bytesLoaded = -1

      req.onerror = () => {
        const err: any = new Error('HTTP request failed')

        err.response = {
          headers,
          readyState: 4,
          status: xhr.status,
          text: xhr.responseText
        }

        if (observer.error) {
          observer.error(err)
        }

        if (observer.complete) {
          observer.complete()
        }

        req = null
      }

      req.onprogress = (evt: ProgressEvent) => {
        if (evt.lengthComputable) {
          bytesTotal = evt.total
          bytesLoaded = evt.loaded
          observer.next({
            bytesLoaded,
            bytesTotal,
            headers,
            readyState: 3,
            status
          })
        }
      }

      req.onreadystatechange = () => {
        switch (xhr.readyState) {
          case 0: // xhr.UNSET:
            observer.next({readyState: 0})
            break
          case 1: // xhr.OPENED:
            observer.next({readyState: 1})
            req.send()
            break
          case 2: // xhr.HEADERS_RECEIVED:
            status = xhr.status
            headers = xhr
              .getAllResponseHeaders()
              .trim()
              .split('\n')
              .reduce(
                // tslint:disable-next-line no-shadowed-variable
                (headers, line) => {
                  const parts = line.split(/:/)
                  headers[parts[0].trim()] = parts[1].trim()
                  return headers
                },
                {} as IHeaders
              )
            observer.next({readyState: 2, headers, status})
            break
          case 3: // xhr.LOADING:
            observer.next({
              readyState: 3,
              headers,
              status,
              bytesTotal,
              bytesLoaded
            })
            break
          case 4: // xhr.DONE:
            observer.next({
              readyState: 4,
              headers,
              status,
              text: xhr.responseText,
              bytesTotal,
              bytesLoaded
            })
            if (observer.complete) {
              observer.complete()
            }
            req = null
            break
        }
      }

      req.open(method, url, async)

      return {
        unsubscribe() {
          if (observer.complete) {
            observer.complete()
          }
          if (req) {
            req.abort()
            req = null
          }
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
