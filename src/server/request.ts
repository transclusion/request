import * as http from 'http'
import * as https from 'https'
import {parse as parseUrl} from 'url'
import {RequestOpts, Response, ResponseHeaders, ResponseObserver} from '../types'
import {parseHeaders} from './helpers'

interface INodeReqOpts {
  method: string
  host: string | null
  port: string | null
  path: string | null
  headers?: ResponseHeaders
}

export function request(method: string, url: string, opts: RequestOpts = {}) {
  const subscribe = (observer: ResponseObserver) => {
    const urlInfo = parseUrl(url)
    const protocol = urlInfo.protocol
    const transport: any = protocol === 'https:' ? https : http
    const reqOpts: INodeReqOpts = {
      method,
      host: urlInfo.hostname,
      port: urlInfo.port,
      path: urlInfo.path
    }

    let req: any = null
    let headers: ResponseHeaders
    let text: string = ''
    let isComplete = false

    // Set `.headers` on request options
    if (opts.headers) {
      reqOpts.headers = opts.headers
    }

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

    // Perform request
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

  return {
    subscribe
  }
}
