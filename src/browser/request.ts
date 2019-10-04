import {RequestOpts, Response, ResponseHeaders, ResponseObserver} from '../types'

export function request(method: string, url: string, opts: RequestOpts = {}) {
  return {
    subscribe(observer: ResponseObserver) {
      const xhr: XMLHttpRequest = new XMLHttpRequest()
      const reqHeaders = opts.headers

      let status = 200
      let headers: ResponseHeaders = {}
      let bytesTotal = -1
      let bytesLoaded = -1
      let isCompleted = false

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
        switch (xhr.readyState) {
          case 0: // xhr.UNSET:
            handleNext({readyState: 0})
            break

          case 1: // xhr.OPENED:
            handleNext({readyState: 1})
            if (reqHeaders) {
              Object.keys(reqHeaders).forEach(key => {
                xhr.setRequestHeader(key, reqHeaders[key])
              })
            }
            xhr.send(opts.body)
            break

          case 2: // xhr.HEADERS_RECEIVED:
            status = xhr.status
            headers = xhr
              .getAllResponseHeaders()
              .trim()
              .split('\n')
              .reduce(
                // tslint:disable-next-line no-shadowed-variable
                (headers, line) => {
                  const parts = line.split(/:/)
                  if (parts.length === 2) {
                    headers[parts[0].trim()] = parts[1].trim()
                  }
                  return headers
                },
                {} as ResponseHeaders
              )
            handleNext({readyState: 2, headers, status})
            break

          case 3: // xhr.LOADING:
            handleNext({
              readyState: 3,
              headers,
              status,
              bytesTotal,
              bytesLoaded
            })
            break

          case 4: // xhr.DONE:
            handleNext({
              readyState: 4,
              headers,
              status,
              text: xhr.responseText,
              bytesTotal,
              bytesLoaded
            })
            handleComplete()
            break
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
  }
}
