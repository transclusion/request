import * as http from 'http'
import * as https from 'https'
import {parse as parseUrl} from 'url'
import {RequestOpts, Response, ResponseHeaders, ResponseObserver} from '../types'

function parseHeaders(rawHeaders: any) {
  return Object.keys(rawHeaders).reduce(
    (headers, key) => {
      const lowerCaseKey = key.toLowerCase()
      const val = rawHeaders[key]

      if (typeof val === 'string') {
        headers[lowerCaseKey] = val
      } else if (val instanceof Array) {
        headers[lowerCaseKey] = val.join(' ')
      }

      return headers
    },
    {} as ResponseHeaders
  )
}

interface INodeReqOpts {
  method: string
  host?: string
  port?: string
  path?: string
  headers?: ResponseHeaders
}

export function request(method: string, url: string, opts: RequestOpts = {}) {
  let req: any = null
  let headers: ResponseHeaders

  return {
    subscribe(observer: ResponseObserver) {
      const urlInfo = parseUrl(url)
      const protocol = urlInfo.protocol
      const transport: any = protocol === 'https:' ? https : http
      const reqOpts: INodeReqOpts = {
        method,
        host: urlInfo.hostname,
        port: urlInfo.port,
        path: urlInfo.path
      }

      if (opts.headers) {
        reqOpts.headers = opts.headers
      }

      let text: string = ''
      let isComplete = false

      function handleNext(res: Response) {
        if (!isComplete) {
          observer.next(res)
        }
      }

      function handleError(err: Error) {
        if (observer.error) {
          observer.error(err)
        }

        handleComplete()
      }

      function handleComplete() {
        if (observer.complete) {
          observer.complete()
          isComplete = true
        }
      }

      req = transport.request(reqOpts, (res: any) => {
        res.on('data', (buf: Buffer) => {
          headers = headers || parseHeaders(res.headers)

          text += buf.toString()

          handleNext({
            readyState: 3,
            headers,
            bytesLoaded: text.length,
            bytesTotal: Number(headers['content-length'] || -1),
            status: res.statusCode || 0
          })
        })

        res.on('error', () => {
          handleError(new Error('Something went wrong'))
        })

        res.on('abort', () => {
          handleComplete()
        })

        res.on('end', () => {
          handleNext({
            readyState: 4,
            headers: headers || parseHeaders(res.headers),
            status: res.statusCode || 0,
            text,
            bytesTotal: Buffer.byteLength(text, 'utf8'),
            bytesLoaded: Buffer.byteLength(text, 'utf8')
          })
          handleComplete()
        })
      })

      if (opts.body) {
        req.write(opts.body)
      }

      req.end()

      return {
        unsubscribe() {
          handleComplete()
          req.abort()
        }
      }
    }
  }
}
