import {ResponseHeaders} from '../types'

export function getHeadersFromXHR(xhr: XMLHttpRequest) {
  return xhr
    .getAllResponseHeaders()
    .trim()
    .split('\n')
    .reduce(
      (acc, x) => {
        const parts = x.split(/:/)
        if (parts.length === 2) {
          acc[parts[0].trim()] = parts[1].trim()
        }
        return acc
      },
      {} as ResponseHeaders
    )
}
