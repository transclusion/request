import {Response} from './types'

/** @public */
export class RequestError extends Error {
  response: Response

  constructor(message: string, response: Response) {
    super(message)
    this.name = 'RequestError'
    this.response = response
  }
}
