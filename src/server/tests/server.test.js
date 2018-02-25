import { listenOnPort } from '../server'

describe('listenOnPort()', () => {
  const listen = jest.fn()
  const app = { listen }
  const port = 3333
  const isProd = false

  beforeEach(() => {
    listen.mockReset()
  })

  it('should call the listen method on the app argument', () => {
    listenOnPort(port, isProd, app).run()
    expect(listen).toHaveBeenCalled()
  })

  it('should call port as its first argument', () => {
    listenOnPort(port, isProd, app).run()
    expect(listen.mock.calls[0][0]).toBe(port)
  })
})
