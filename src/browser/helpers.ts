import {ResponseHeaders} from '../types'

export function getHeadersFromXHR(xhr: XMLHttpRequest): ResponseHeaders {
  return xhr
    .getAllResponseHeaders()
    .trim()
    .split('\n')
    .reduce((acc: ResponseHeaders, x) => {
      const parts = x.split(/:/)

      if (parts.length >= 2) {
        const key = parts.shift()?.trim()
        const value = parts.join(':').trim()

        if (key) {
          acc[key] = value
        }
      }

      return acc
    }, {})
}
