export interface IHeaders {
  [key: string]: string
}

export interface IOpts {
  headers?: IHeaders
  body?: string
}

export type StatusCode = number | null

export interface IResponseUnset {
  readyState: 0
}

export interface IResponseOpened {
  readyState: 1
}

export interface IResponseHeadersReceived {
  readyState: 2
  headers: IHeaders
  status: StatusCode
}

export interface IResponseLoading {
  readyState: 3
  headers: IHeaders
  status: StatusCode
  bytesLoaded: number
  bytesTotal: number
}

export interface IResponseDone {
  readyState: 4
  headers: IHeaders
  status: StatusCode
  text: string
  bytesLoaded: number
  bytesTotal: number
}

export type Response =
  | IResponseUnset
  | IResponseOpened
  | IResponseHeadersReceived
  | IResponseLoading
  | IResponseDone

export interface IResponseObserver {
  next: (res: Response) => void
  error?: (err: any) => void
  complete?: () => void
}
