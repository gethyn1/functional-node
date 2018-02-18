import { fromPairs, defineConnections, getConnections, closeConnection } from '../db'

describe('fromPairs()', () => {
  it('should return an object', () => {
    expect(fromPairs({}, [])).toEqual({})
  })

  it('should return an object with new props set from array', () => {
    expect(fromPairs({ a: 'b' }, ['c', 'd'])).toEqual({ a: 'b', c: 'd' })
  })
})

describe('defineConnections()', () => {
  it('should return an object from an array of pairs with mapping pair to `key: prop`', () => {
    expect(defineConnections([['a', 'b'], ['c', 'd']])).toEqual({ a: 'b', c: 'd' })
  })
})

describe('getConnections()', () => {
  it('should return an array with populated with property values of argument', () => {
    expect(getConnections({ a: 'b', c: 'd' })).toEqual(['b', 'd'])
  })
})

describe('closeConnection()', () => {
  it('should call the close method on the connection argument', () => {
    const close = jest.fn()
    closeConnection({ close })
    expect(close).toHaveBeenCalled()
  })
})
