import {RequestOpts, Response, ResponseHeaders, ResponseObserver} from '../types'
import {request} from './request'

export {RequestOpts, Response, ResponseHeaders, ResponseObserver}

export function get(url: string, opts?: RequestOpts) {
  return request('GET', url, opts)
}

export function post(url: string, opts?: RequestOpts) {
  return request('POST', url, opts)
}

export function put(url: string, opts?: RequestOpts) {
  return request('PUT', url, opts)
}

export function head(url: string, opts?: RequestOpts) {
  return request('HEAD', url, opts)
}

export function del(url: string, opts?: RequestOpts) {
  return request('DELETE', url, opts)
}

export function options(url: string, opts?: RequestOpts) {
  return request('OPTIONS', url, opts)
}

export function trace(url: string, opts?: RequestOpts) {
  return request('TRACE', url, opts)
}

export function copy(url: string, opts?: RequestOpts) {
  return request('COPY', url, opts)
}

export function lock(url: string, opts?: RequestOpts) {
  return request('LOCK', url, opts)
}

export function mkcol(url: string, opts?: RequestOpts) {
  return request('MKCOL', url, opts)
}

export function move(url: string, opts?: RequestOpts) {
  return request('MOVE', url, opts)
}

export function purge(url: string, opts?: RequestOpts) {
  return request('PURGE', url, opts)
}

export function propfind(url: string, opts?: RequestOpts) {
  return request('PROPFIND', url, opts)
}

export function proppatch(url: string, opts?: RequestOpts) {
  return request('PROPPATCH', url, opts)
}

export function unlock(url: string, opts?: RequestOpts) {
  return request('UNLOCK', url, opts)
}

export function report(url: string, opts?: RequestOpts) {
  return request('REPORT', url, opts)
}

export function mkactivity(url: string, opts?: RequestOpts) {
  return request('MKACTIVITY', url, opts)
}

export function checkout(url: string, opts?: RequestOpts) {
  return request('CHECKOUT', url, opts)
}

export function merge(url: string, opts?: RequestOpts) {
  return request('MERGE', url, opts)
}

export function mSearch(url: string, opts?: RequestOpts) {
  return request('M-SEARCH', url, opts)
}

export function notify(url: string, opts?: RequestOpts) {
  return request('NOTIFY', url, opts)
}

export function subscribe(url: string, opts?: RequestOpts) {
  return request('SUBSCRIBE', url, opts)
}

export function unsubscribe(url: string, opts?: RequestOpts) {
  return request('UNSUBSCRIBE', url, opts)
}

export function patch(url: string, opts?: RequestOpts) {
  return request('PATCH', url, opts)
}

export function search(url: string, opts?: RequestOpts) {
  return request('SEARCH', url, opts)
}

export function connect(url: string, opts?: RequestOpts) {
  return request('CONNECT', url, opts)
}
