import {RequestError} from '../RequestError'
import {RequestObservable, RequestOpts, Response, ResponseHeaders, ResponseObserver} from '../types'
import {_parseHeaders} from './helpers'

/** @public */
export function request(method: string, url: string, opts: RequestOpts = {}): RequestObservable {
  function subscribe(observer: ResponseObserver) {
    const _req: XMLHttpRequest = new XMLHttpRequest()

    let _isCompleted = false

    let status = 200
    let headers: ResponseHeaders = {}
    let bytesTotal = -1
    let bytesLoaded = -1

    function _handleNext(res: Response) {
      if (!_isCompleted) {
        observer.next(res)
      }
    }

    function _handleComplete() {
      if (!_isCompleted) {
        observer.complete?.()
        _isCompleted = true
      }
    }

    function _handleError(err: Error) {
      if (!_isCompleted) {
        observer.error?.(err)
      }

      _handleComplete()
    }

    _req.onerror = () => {
      _handleError(
        new RequestError('HTTP request failed', {
          bytesLoaded,
          bytesTotal,
          headers,
          readyState: 4,
          status: _req.status,
          text: _req.responseText,
        })
      )
    }

    _req.onprogress = (evt: ProgressEvent) => {
      if (evt.lengthComputable) {
        bytesTotal = evt.total
        bytesLoaded = evt.loaded

        _handleNext({
          bytesLoaded,
          bytesTotal,
          headers,
          readyState: 3,
          status,
        })
      }
    }

    _req.onreadystatechange = () => {
      const {readyState} = _req

      if (readyState === 0) {
        _handleNext({readyState})
      }

      if (readyState === 1) {
        _handleNext({readyState})

        try {
          // Set XHR request headers
          if (opts.headers) {
            for (const [key, value] of Object.entries(opts.headers)) {
              _req.setRequestHeader(key, value)
            }
          }

          _req.send(opts.body)
        } catch (err) {
          if (err instanceof Error) {
            _handleError(err)
          } else {
            _handleError(new Error('unknown error'))
          }
        }
      }

      if (readyState === 2) {
        status = _req.status

        // Get response headers from XHR
        headers = _parseHeaders(_req)

        _handleNext({
          readyState,
          headers,
          status,
        })
      }

      if (readyState === 3) {
        _handleNext({
          readyState,
          headers,
          status,
          bytesTotal,
          bytesLoaded,
        })
      }

      if (readyState === 4) {
        _handleNext({
          readyState: 4,
          headers,
          status,
          text: _req.responseText,
          bytesTotal,
          bytesLoaded,
        })

        _handleComplete()
      }
    }

    try {
      _req.open(
        method,
        url,
        true, // always perform async request
        opts.username,
        opts.password
      )
    } catch (err) {
      if (err instanceof Error) {
        _handleError(err)
      } else {
        _handleError(new Error('unknown error'))
      }
    }

    function unsubscribe() {
      _handleComplete()
      _req.abort()
    }

    return {unsubscribe}
  }

  return {subscribe}
}
