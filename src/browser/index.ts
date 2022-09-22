import {RequestObservable, RequestOpts} from '../types'
import {request} from './request'

export * from '../RequestError'
export * from '../types'

/** @public */
export function get(url: string, opts?: RequestOpts): RequestObservable {
  return request('GET', url, opts)
}

/** @public */
export function post(url: string, opts?: RequestOpts): RequestObservable {
  return request('POST', url, opts)
}

/** @public */
export function put(url: string, opts?: RequestOpts): RequestObservable {
  return request('PUT', url, opts)
}

/** @public */
export function head(url: string, opts?: RequestOpts): RequestObservable {
  return request('HEAD', url, opts)
}

/** @public */
export function del(url: string, opts?: RequestOpts): RequestObservable {
  return request('DELETE', url, opts)
}

/** @public */
export function options(url: string, opts?: RequestOpts): RequestObservable {
  return request('OPTIONS', url, opts)
}

/** @public */
export function trace(url: string, opts?: RequestOpts): RequestObservable {
  return request('TRACE', url, opts)
}

/** @public */
export function copy(url: string, opts?: RequestOpts): RequestObservable {
  return request('COPY', url, opts)
}

/** @public */
export function lock(url: string, opts?: RequestOpts): RequestObservable {
  return request('LOCK', url, opts)
}

/** @public */
export function mkcol(url: string, opts?: RequestOpts): RequestObservable {
  return request('MKCOL', url, opts)
}

/** @public */
export function move(url: string, opts?: RequestOpts): RequestObservable {
  return request('MOVE', url, opts)
}

/** @public */
export function purge(url: string, opts?: RequestOpts): RequestObservable {
  return request('PURGE', url, opts)
}

/** @public */
export function propfind(url: string, opts?: RequestOpts): RequestObservable {
  return request('PROPFIND', url, opts)
}

/** @public */
export function proppatch(url: string, opts?: RequestOpts): RequestObservable {
  return request('PROPPATCH', url, opts)
}

/** @public */
export function unlock(url: string, opts?: RequestOpts): RequestObservable {
  return request('UNLOCK', url, opts)
}

/** @public */
export function report(url: string, opts?: RequestOpts): RequestObservable {
  return request('REPORT', url, opts)
}

/** @public */
export function mkactivity(url: string, opts?: RequestOpts): RequestObservable {
  return request('MKACTIVITY', url, opts)
}

/** @public */
export function checkout(url: string, opts?: RequestOpts): RequestObservable {
  return request('CHECKOUT', url, opts)
}

/** @public */
export function merge(url: string, opts?: RequestOpts): RequestObservable {
  return request('MERGE', url, opts)
}

/** @public */
export function mSearch(url: string, opts?: RequestOpts): RequestObservable {
  return request('M-SEARCH', url, opts)
}

/** @public */
export function notify(url: string, opts?: RequestOpts): RequestObservable {
  return request('NOTIFY', url, opts)
}

/** @public */
export function subscribe(url: string, opts?: RequestOpts): RequestObservable {
  return request('SUBSCRIBE', url, opts)
}

/** @public */
export function unsubscribe(url: string, opts?: RequestOpts): RequestObservable {
  return request('UNSUBSCRIBE', url, opts)
}

/** @public */
export function patch(url: string, opts?: RequestOpts): RequestObservable {
  return request('PATCH', url, opts)
}

/** @public */
export function search(url: string, opts?: RequestOpts): RequestObservable {
  return request('SEARCH', url, opts)
}

/** @public */
export function connect(url: string, opts?: RequestOpts): RequestObservable {
  return request('CONNECT', url, opts)
}
