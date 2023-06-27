import { log, deprecated } from '../_utils/index'

describe('log', () => {
  it('should invoke success', () => {
    let res = log('test')
    expect(log).toBeInstanceOf(Function)
    expect(res).toBeTruthy()
  })

  it('should return a function', () => {
    let res = log('test')
    expect(log).toBeInstanceOf(Function)
    expect(res).toBeTruthy()
    expect(res).toBeInstanceOf(Function)

    let res2 = log('test', 'extra param')
    expect(log).toBeInstanceOf(Function)
    expect(res2).toBeTruthy()
    expect(res2).toBeInstanceOf(Function)

    let res3 = log()
    expect(res3).toBeTruthy()
    expect(res3).toBeInstanceOf(Function)
  })
})
