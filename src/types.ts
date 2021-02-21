export interface ResponseHeaders {
  [key: string]: string
}

export interface RequestOpts {
  headers?: ResponseHeaders
  body?: string
}

export type StatusCode = number | null

export interface ResponseUnset {
  readyState: 0
}

export interface ResponseOpened {
  readyState: 1
}

export interface ResponseHeadersReceived {
  readyState: 2
  headers: ResponseHeaders
  status: StatusCode
}

export interface ResponseLoading {
  readyState: 3
  headers: ResponseHeaders
  status: StatusCode
  bytesLoaded: number
  bytesTotal: number
}

export interface ResponseDone {
  readyState: 4
  headers: ResponseHeaders
  status: StatusCode
  text: string
  bytesLoaded: number
  bytesTotal: number
}

export type Response =
  | ResponseUnset
  | ResponseOpened
  | ResponseHeadersReceived
  | ResponseLoading
  | ResponseDone

export interface ResponseObserver {
  next: (res: Response) => void
  error?: (err: Error) => void
  complete?: () => void
}

export interface RequestObservable {
  subscribe: (
    observer: ResponseObserver
  ) => {
    unsubscribe: () => void
  }
}
