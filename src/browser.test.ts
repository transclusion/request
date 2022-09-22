import xhrMock from 'xhr-mock'
import {get, post} from '../src/browser'

describe('request/browser', () => {
  beforeEach(() => {
    xhrMock.setup()

    xhrMock.get('/', {
      headers: {'Content-Length': '13'},
      body: 'Hello, world!',
    })

    xhrMock.post('/identity', (req, res) =>
      res
        .status(201)
        .header('content-type', req.header('content-type') || 'application/json')
        .body(req.body())
    )
  })

  afterEach(() => xhrMock.teardown())

  it('should send a basic GET request', (done) => {
    const observer = {
      next: jest.fn(),
      error: jest.fn(),
      complete() {
        expect(observer.error.mock.calls).toHaveLength(0)

        const callsLen = observer.next.mock.calls.length
        const lastValue = observer.next.mock.calls[callsLen - 1][0]

        expect(lastValue.readyState).toBe(4)
        expect(lastValue.text).toBe('Hello, world!')
        expect(lastValue.bytesLoaded).toBe(13)
        expect(lastValue.bytesTotal).toBe(13)

        done()
      },
    }

    get('/').subscribe(observer)
  })

  it('should send a POST request with a body', (done) => {
    const postOpts = {
      body: JSON.stringify({id: 'foo'}),
      headers: {
        'content-type': 'application/json',
      },
    }

    const observer = {
      next: jest.fn(),
      error: jest.fn(),
      complete() {
        expect(observer.error.mock.calls).toHaveLength(0)

        const callsLen = observer.next.mock.calls.length
        const lastValue = observer.next.mock.calls[callsLen - 1][0]

        expect(lastValue.readyState).toBe(4)
        expect(lastValue.headers).toEqual(postOpts.headers)
        expect(lastValue.text).toBe(postOpts.body)

        done()
      },
    }

    post('/identity', postOpts).subscribe(observer)
  })
})
