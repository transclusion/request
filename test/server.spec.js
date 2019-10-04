const nock = require('nock')
const request = require('../src/server')

describe('request/server', () => {
  it('should send a basic GET request', done => {
    nock('http://test')
      .get('/')
      .reply(200, 'Hello, world!')

    const next = jest.fn()
    const error = jest.fn()

    request.get('http://test/').subscribe({
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
      }
    })
  })

  it('should send a POST request with a body', done => {
    nock('http://test')
      .post('/identity')
      .reply(function(_, requestBody) {
        return [
          201,
          requestBody,
          {'content-type': this.req.headers['content-type'] || 'text/plain'} // optional headers
        ]
      })

    const next = jest.fn()
    const error = jest.fn()
    const postOpts = {
      body: JSON.stringify({id: 'foo'}),
      headers: {
        'content-type': 'application/json'
      }
    }

    request.post('http://test/identity', postOpts).subscribe({
      next,
      error,
      complete() {
        const callsLen = next.mock.calls.length
        const lastValue = next.mock.calls[callsLen - 1][0]

        expect(lastValue.readyState).toBe(4)
        expect(lastValue.headers).toEqual(postOpts.headers)
        expect(lastValue.text).toBe(postOpts.body)
        done()
      }
    })
  })
})
