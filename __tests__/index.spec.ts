/**
 * @jest-environment jsdom
 */

jest.setTimeout(30000)
jest.spyOn(window.localStorage.__proto__, 'setItem')
window.localStorage.__proto__.setItem = jest.fn()

const taro = {
  setStorageSync: () => {
    return ''
  },
  getStorageSync: () => {
    return ''
  },
  removeStorageSync: () => {
    return ''
  },
  clearStorageSync: () => {
    return ''
  },
}

import DataBlock from '../src/index'
let dataBlock: DataBlock = new DataBlock({
  key: 'test',
  api: 'local',
})

describe('Local DataBlock', () => {
  const key = 'test_key'
  const val = 'test_val'

  beforeEach(() => {
    dataBlock = new DataBlock({
      key: 'test',
      api: 'local',
    })
  })

  jest.spyOn(dataBlock, 'get')

  let spyGet = jest.spyOn(dataBlock, 'get')

  it('called', () => {
    expect(spyGet).toHaveBeenCalled()
  })
})
