import {RequestOpts, Response, ResponseHeaders, ResponseObserver} from '../types'
import {getHeadersFromXHR} from './helpers'

export function request(method: string, url: string, opts: RequestOpts = {}) {
  const subscribe = (observer: ResponseObserver) => {
    const xhr: XMLHttpRequest = new XMLHttpRequest()

    let status = 200
    let headers: ResponseHeaders = {}
    let bytesTotal = -1
    let bytesLoaded = -1
    let isCompleted = false

    const reqHeaders = opts.headers || {}

    function handleNext(res: Response) {
      if (!isCompleted) {
        observer.next(res)
      }
    }

    function handleComplete() {
      if (!isCompleted && observer.complete) {
        observer.complete()
        isCompleted = true
      }
    }

    function handleError(err: Error) {
      if (!isCompleted && observer.error) {
        observer.error(err)
      }

      handleComplete()
    }

    xhr.onerror = () => {
      const err: any = new Error('HTTP request failed')

      err.response = {
        headers,
        readyState: 4,
        status: xhr.status,
        text: xhr.responseText
      }

      handleError(err)
    }

    xhr.onprogress = (evt: ProgressEvent) => {
      if (evt.lengthComputable) {
        bytesTotal = evt.total
        bytesLoaded = evt.loaded

        handleNext({
          bytesLoaded,
          bytesTotal,
          headers,
          readyState: 3,
          status
        })
      }
    }

    xhr.onreadystatechange = () => {
      const {readyState} = xhr

      if (readyState === 0) {
        handleNext({readyState})
      } else if (readyState === 1) {
        handleNext({readyState})

        Object.keys(reqHeaders).forEach(key => {
          xhr.setRequestHeader(key, reqHeaders[key])
        })

        xhr.send(opts.body)
      } else if (readyState === 2) {
        status = xhr.status
        headers = getHeadersFromXHR(xhr)

        handleNext({
          readyState,
          headers,
          status
        })
      } else if (readyState === 3) {
        handleNext({
          readyState,
          headers,
          status,
          bytesTotal,
          bytesLoaded
        })
      } else if (readyState === 4) {
        handleNext({
          readyState: 4,
          headers,
          status,
          text: xhr.responseText,
          bytesTotal,
          bytesLoaded
        })

        handleComplete()
      }
    }

    xhr.open(method, url, true)

    return {
      unsubscribe() {
        handleComplete()

        if (xhr) {
          xhr.abort()
        }
      }
    }
  }

  return {subscribe}
}
