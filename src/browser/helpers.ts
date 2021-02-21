import {ResponseHeaders} from '../types'

export function getHeadersFromXHR(xhr: XMLHttpRequest): ResponseHeaders {
  const headers: ResponseHeaders = {}

  return xhr
    .getAllResponseHeaders()
    .trim()
    .split('\n')
    .reduce((acc, x) => {
      const pair = x.split(/:/)

      if (pair.length === 2) {
        const key = pair[0].trim()
        const value = pair[1].trim()

        acc[key] = value
      }

      return acc
    }, headers)
}
