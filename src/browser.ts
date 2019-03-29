import {IHeaders, IOpts, IResponseObserver, Response} from './types'

function request(method: string, url: string, opts: IOpts = {}) {
  return {
    subscribe(observer: IResponseObserver) {
      const xhr: XMLHttpRequest = new XMLHttpRequest()
      const reqHeaders = opts.headers

      let status = 0
      let headers: IHeaders = {}
      let bytesTotal = -1
      let bytesLoaded = -1
      let isCompleted = false

      function handleNext(res: Response) {
        if (!isCompleted) {
          observer.next(res)
        }
      }

      function handleComplete() {
        if (!isCompleted && observer.complete) {
          observer.complete()
          isCompleted = true
        }
      }

      function handleError(err: Error) {
        if (!isCompleted && observer.error) {
          observer.error(err)
        }

        handleComplete()
      }

      xhr.onerror = () => {
        const err: any = new Error('HTTP request failed')

        err.response = {
          headers,
          readyState: 4,
          status: xhr.status,
          text: xhr.responseText
        }

        handleError(err)
      }

      xhr.onprogress = (evt: ProgressEvent) => {
        if (evt.lengthComputable) {
          bytesTotal = evt.total
          bytesLoaded = evt.loaded
          handleNext({
            bytesLoaded,
            bytesTotal,
            headers,
            readyState: 3,
            status
          })
        }
      }

      xhr.onreadystatechange = () => {
        switch (xhr.readyState) {
          case 0: // xhr.UNSET:
            handleNext({readyState: 0})
            break

          case 1: // xhr.OPENED:
            handleNext({readyState: 1})
            if (reqHeaders) {
              Object.keys(reqHeaders).forEach(key => {
                xhr.setRequestHeader(key, reqHeaders[key])
              })
            }
            xhr.send(opts.body)
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
            handleNext({readyState: 2, headers, status})
            break

          case 3: // xhr.LOADING:
            handleNext({
              readyState: 3,
              headers,
              status,
              bytesTotal,
              bytesLoaded
            })
            break

          case 4: // xhr.DONE:
            handleNext({
              readyState: 4,
              headers,
              status,
              text: xhr.responseText,
              bytesTotal,
              bytesLoaded
            })
            handleComplete()
            break
        }
      }

      xhr.open(method, url, true)

      return {
        unsubscribe() {
          handleComplete()

          if (xhr) {
            xhr.abort()
          }
        }
      }
    }
  }
}

function get(url: string, opts?: IOpts) {
  return request('GET', url, opts)
}

function post(url: string, opts?: IOpts) {
  return request('POST', url, opts)
}

function put(url: string, opts?: IOpts) {
  return request('PUT', url, opts)
}

function head(url: string, opts?: IOpts) {
  return request('HEAD', url, opts)
}

function del(url: string, opts?: IOpts) {
  return request('DELETE', url, opts)
}

function options(url: string, opts?: IOpts) {
  return request('OPTIONS', url, opts)
}

function trace(url: string, opts?: IOpts) {
  return request('TRACE', url, opts)
}

function copy(url: string, opts?: IOpts) {
  return request('COPY', url, opts)
}

function lock(url: string, opts?: IOpts) {
  return request('LOCK', url, opts)
}

function mkcol(url: string, opts?: IOpts) {
  return request('MKCOL', url, opts)
}

function move(url: string, opts?: IOpts) {
  return request('MOVE', url, opts)
}

function purge(url: string, opts?: IOpts) {
  return request('PURGE', url, opts)
}

function propfind(url: string, opts?: IOpts) {
  return request('PROPFIND', url, opts)
}

function proppatch(url: string, opts?: IOpts) {
  return request('PROPPATCH', url, opts)
}

function unlock(url: string, opts?: IOpts) {
  return request('UNLOCK', url, opts)
}

function report(url: string, opts?: IOpts) {
  return request('REPORT', url, opts)
}

function mkactivity(url: string, opts?: IOpts) {
  return request('MKACTIVITY', url, opts)
}

function checkout(url: string, opts?: IOpts) {
  return request('CHECKOUT', url, opts)
}

function merge(url: string, opts?: IOpts) {
  return request('MERGE', url, opts)
}

function mSearch(url: string, opts?: IOpts) {
  return request('M-SEARCH', url, opts)
}

function notify(url: string, opts?: IOpts) {
  return request('NOTIFY', url, opts)
}

function subscribe(url: string, opts?: IOpts) {
  return request('SUBSCRIBE', url, opts)
}

function unsubscribe(url: string, opts?: IOpts) {
  return request('UNSUBSCRIBE', url, opts)
}

function patch(url: string, opts?: IOpts) {
  return request('PATCH', url, opts)
}

function search(url: string, opts?: IOpts) {
  return request('SEARCH', url, opts)
}

function connect(url: string, opts?: IOpts) {
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
