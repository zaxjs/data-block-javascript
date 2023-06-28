/**
 * @jest-environment jsdom
 */

import DataBlock from '../src/index'
import type { DataBlocksInterface } from '../src/index'

var dataBlock: DataBlock

const config = {
  api: 'https://abyss-pre.zan.fun/data-block-service-api/v1/open',
  key: 'Y2wwemk4aWtnMDAwMjA4bDQ4c3VrZzB5bA==',
}

describe('DataBlock', () => {
  beforeEach(() => {
    dataBlock = new DataBlock({
      ...config,
    })
  })

  it('Check member', () => {
    expect(dataBlock).toBeTruthy()

    expect(dataBlock).toHaveProperty('api')
    expect(dataBlock).toHaveProperty('key')

    expect(dataBlock).toHaveProperty('kv')
    expect(dataBlock).toHaveProperty('block')
    expect(dataBlock).toHaveProperty('getBlock')
    expect(dataBlock).toHaveProperty('getKv')

    expect(dataBlock).toHaveProperty('keyType')
    expect(dataBlock).toHaveProperty('keyType', undefined)
  })
})

describe('DataBlock/block', () => {
  beforeEach(() => {
    dataBlock = new DataBlock({
      ...config,
    })
  })

  it('Check invoke', async () => {
    var spyBlock = jest.spyOn(dataBlock, 'block')

    await dataBlock.block(['TEST_BLOCK', 'TEST_MISC']).catch((err) => {
      console.error('dataBlock/block', err)
      throw err
    })

    await dataBlock.block('TEST_BLOCK').catch((err) => {
      console.error('dataBlock/block', err)
      throw err
    })

    var res = await dataBlock.getBlock('TEST_BLOCK').catch((err) => {
      console.error('dataBlock/block', err)
      throw err
    })

    expect(res).toBeTruthy()
    expect(res).toBeInstanceOf(Object)
    expect(res['TEST_BLOCK'].blockCode).toEqual('TEST_BLOCK')
    expect(res['TEST_BLOCK'].blockData).toBeInstanceOf(Object)

    expect(dataBlock).toHaveProperty('keyType', 'block')

    expect(spyBlock).toHaveBeenCalled()
  })
})

describe('DataBlock/kv', () => {
  beforeEach(() => {
    dataBlock = new DataBlock({
      ...config,
      keyType: 'kv',
    })
  })

  it('Check invoke', async () => {
    var spyKv = jest.spyOn(dataBlock, 'kv')

    await dataBlock.kv(['TEST_KEY', 'TEST_KEY3']).catch((err) => {
      console.error('dataBlock/kv', err)
      throw err
    })

    await dataBlock.kv(['TEST_KEY']).catch((err) => {
      console.error('dataBlock/kv', err)
      throw err
    })

    var res = await dataBlock.getKv(['TEST_KEY']).catch((err) => {
      console.error('dataBlock/kv', err)
      throw err
    })

    expect(res).toBeTruthy()
    expect(res).toBeInstanceOf(Object)
    expect(res['TEST_KEY'].k).toEqual('TEST_KEY')
    expect(res['TEST_KEY'].v).toBeInstanceOf(Object)

    expect(dataBlock).toHaveProperty('keyType', 'kv')

    expect(spyKv).toHaveBeenCalled()
  })
})
