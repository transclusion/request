import {ResponseHeaders} from '../types'

/** @internal */
export function _parseHeaders(xhr: XMLHttpRequest): ResponseHeaders {
  return xhr
    .getAllResponseHeaders()
    .trim()
    .split('\n')
    .reduce<ResponseHeaders>((acc, x) => {
      const parts = x.split(/:/)

      if (parts.length >= 2) {
        const key = parts.shift()?.trim()

        if (key) {
          acc[key] = parts.join(':').trim()
        }
      }

      return acc
    }, {})
}
