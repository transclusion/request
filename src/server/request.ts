import * as http from 'http'
import * as https from 'https'
import {URL} from 'url'
import {ClientRequest} from 'node:http'
import {RequestObservable, RequestOpts, Response, ResponseHeaders, ResponseObserver} from '../types'
import {parseHeaders} from './helpers'

interface INodeReqOpts {
  method: string
  host: string | null
  port: string | null
  path: string | null
  headers?: ResponseHeaders
}

export function request(
  method: string,
  urlString: string,
  opts: RequestOpts = {}
): RequestObservable {
  const subscribe = (observer: ResponseObserver) => {
    const url = new URL(urlString, 'http://0.0.0.0/')
    const protocol = url.protocol
    const transport = protocol === 'https:' ? https : http
    const reqOpts: INodeReqOpts = {
      method,
      host: url.hostname,
      port: url.port,
      path: url.pathname,
    }

    let req: ClientRequest | null = null
    let headers: ResponseHeaders
    let text = ''
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

    req = transport.request(reqOpts, (res) => {
      res.on('data', (buf: Buffer) => {
        headers = headers || parseHeaders(res.headers)

        text += buf.toString()

        handleNext({
          readyState: 3,
          headers,
          bytesLoaded: text.length,
          bytesTotal: Number(headers['content-length'] || -1),
          status: res.statusCode || 0,
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
          bytesLoaded: Buffer.byteLength(text, 'utf8'),
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
        if (req) req.destroy()
      },
    }
  }

  return {
    subscribe,
  }
}
