import {IncomingHttpHeaders} from 'node:http'
import {ResponseHeaders} from '../types'

export function parseHeaders(rawHeaders: IncomingHttpHeaders): ResponseHeaders {
  return Object.keys(rawHeaders).reduce((headers, key) => {
    const lowerCaseKey = key.toLowerCase()
    const val = rawHeaders[key]

    if (typeof val === 'string') {
      headers[lowerCaseKey] = val
    } else if (val instanceof Array) {
      headers[lowerCaseKey] = val.join(' ')
    }

    return headers
  }, {} as ResponseHeaders)
}
