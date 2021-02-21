const xhrMock = require('xhr-mock').default
const request = require('../src/browser')

describe('request/browser', () => {
  beforeEach(() => {
    xhrMock.setup()

    xhrMock.get('/', {
      headers: {'Content-Length': '13'},
      body: 'Hello, world!',
    })

    xhrMock.post('/identity', (req, res) =>
      res.status(201).header('content-type', req.header('content-type')).body(req.body())
    )
  })

  afterEach(() => xhrMock.teardown())

  it('should send a basic GET request', (done) => {
    const next = jest.fn()
    const error = jest.fn()

    request.get('/').subscribe({
      next,
      error,
      complete() {
        const callsLen = next.mock.calls.length
        const lastValue = next.mock.calls[callsLen - 1][0]

        expect(lastValue.readyState).toBe(4)
        expect(lastValue.text).toBe('Hello, world!')
        expect(lastValue.bytesLoaded).toBe(13)
        expect(lastValue.bytesTotal).toBe(13)
        done()
      },
    })
  })

  it('should send a POST request with a body', (done) => {
    const next = jest.fn()
    const error = jest.fn()
    const postOpts = {
      body: JSON.stringify({id: 'foo'}),
      headers: {
        'content-type': 'application/json',
      },
    }

    request.post('/identity', postOpts).subscribe({
      next,
      error,
      complete() {
        const callsLen = next.mock.calls.length
        const lastValue = next.mock.calls[callsLen - 1][0]

        expect(lastValue.readyState).toBe(4)
        expect(lastValue.headers).toEqual(postOpts.headers)
        expect(lastValue.text).toBe(postOpts.body)
        done()
      },
    })
  })
})
