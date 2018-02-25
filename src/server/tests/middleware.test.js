import { use, enable, useInEnvironment } from '../middleware'

describe('middleware', () => {
  const mockUse = jest.fn()
  const mockEnable = jest.fn()
  const middleware = jest.fn()
  const setting = 'test'

  const app = {
    use: mockUse,
    enable: mockEnable,
  }

  beforeEach(() => {
    mockUse.mockReset()
    mockEnable.mockReset()
    middleware.mockReset()
  })

  describe('use()', () => {
    it('should call use on the app argument', () => {
      use(middleware, app)
      expect(mockUse).toHaveBeenCalled()
    })

    it('should call use with the middleware argument', () => {
      use(middleware, app)
      expect(mockUse.mock.calls[0][0]).toEqual(middleware)
    })
  })

  describe('enable()', () => {
    it('should call enable on the app argument', () => {
      enable(setting, app)
      expect(mockEnable).toHaveBeenCalled()
    })

    it('should call enable with the middleware argument', () => {
      enable(setting, app)
      expect(mockEnable.mock.calls[0][0]).toEqual(setting)
    })
  })

  describe('useInEnvironment()', () => {
    const useTest = use(middleware, app)

    it('should return use() if environment is true', () => {
      expect(useInEnvironment(true, middleware, app)).toEqual(useTest)
    })

    it('should return the app argument if environment is false', () => {
      expect(useInEnvironment(false, middleware, app)).toEqual(app)
    })
  })
})
