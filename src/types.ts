/**
 * @public
 */
export interface ResponseHeaders {
  [key: string]: string
}

/**
 * @public
 */
export interface RequestOpts {
  headers?: ResponseHeaders
  body?: string
}

/**
 * @public
 */
export type ResponseStatusCode = number | null

/**
 * @public
 */
export interface ResponseUnset {
  readyState: 0
}

/**
 * @public
 */
export interface ResponseOpened {
  readyState: 1
}

/**
 * @public
 */
export interface ResponseHeadersReceived {
  readyState: 2
  headers: ResponseHeaders
  status: ResponseStatusCode
}

/**
 * @public
 */
export interface ResponseLoading {
  readyState: 3
  headers: ResponseHeaders
  status: ResponseStatusCode
  bytesLoaded: number
  bytesTotal: number
}

/**
 * @public
 */
export interface ResponseDone {
  readyState: 4
  headers: ResponseHeaders
  status: ResponseStatusCode
  text: string
  bytesLoaded: number
  bytesTotal: number
}

/**
 * @public
 */
export type Response =
  | ResponseUnset
  | ResponseOpened
  | ResponseHeadersReceived
  | ResponseLoading
  | ResponseDone

/**
 * @public
 */
export interface ResponseObserver {
  next: (res: Response) => void
  error?: (err: Error) => void
  complete?: () => void
}

/**
 * @public
 */
export interface RequestObservable {
  subscribe: (observer: ResponseObserver) => {
    unsubscribe: () => void
  }
}
