/**
 * DataBlock Module
 * @module @zaxjs/data-block
 * @see https://github.com/zaxjs/data-block-javascript/blob/main/docs/README.md
 */

import { AxiosRequestConfig, AxiosResponse } from 'axios'

const APP_OPEN_KEY = `x-data-block-openkey`

type BaseT = {
  stage?: any
  isMultipleGroup?: any
  atUsers?: any
  blockStatus?: any
  sysId?: any
  createdBy?: any
  createdAt?: any
  updatedBy?: any
  updatedAt?: any
  publishedBy?: any
  publishedAt?: any
  spaceName?: any
  spaceId?: any
  modelCode?: any
  blockCode?: string
  blockData?: {
    id?: string
    cid?: string
    data: Record<string, any>[]
    groupName?: string
    groupPercent?: string
  }[]
  slugs?: any
  syncAt?: any
}

export const distDataBlock = <T extends BaseT>(res: Record<string, T>, opt: Partial<DataBlocksOptions>): Record<string, T> => {
  let { showSysField, showGroupInfo } = opt

  var resAll = Object.values(res)
  // 应用类型，源数据一并delete

  resAll.map((sub) => {
    if (!showSysField) {
      delete sub?.slugs
      delete sub?.stage
      delete sub?.isMultipleGroup
      delete sub?.atUsers
      delete sub?.blockStatus
      delete sub?.sysId
      delete sub?.createdBy
      delete sub?.createdAt
      delete sub?.updatedBy
      delete sub?.updatedAt
      delete sub?.publishedBy
      delete sub?.publishedAt
      delete sub?.spaceName
      delete sub?.spaceId
      delete sub?.modelCode
      delete sub?.syncAt
    }
    if (!showGroupInfo) {
      // 不展示组信息，则只需要data
      if ((sub?.blockData || []).length) {
        const cleanData = sub!.blockData!.map((sub) => {
          return sub.data[0] // 系统设计原因，只有一组
        })
        sub.blockData = cleanData as any
      }
    }
  })

  return res
}

export interface DataBlocksInterface {
  key: string
  api: string
  showSysField?: boolean
  showGroupInfo?: boolean
  ttl?: `${number}${'d' | 'h' | 'm' | 's'}`
  keyType?: 'kv' | 'block'
  taro?: any
  get: <T extends BaseT>(codes: string | string[], options?: DataBlocksOptions) => Promise<Record<string, T>>
  getBlock: <T extends BaseT>(codes: string | string[], options?: DataBlocksOptions) => Promise<Record<string, T>>
  getKv: <T extends BaseT>(codes: string | string[], options?: DataBlocksOptions) => Promise<Record<string, T>>
  getAdapterRequest: <T>(opts: AxiosRequestConfig) => Promise<T>
}

export type DataBlocksOptions = Partial<Omit<DataBlocksInterface, 'get' | 'getBlock' | 'getKv' | 'getAdapterRequest'>>

/**
 * Create a DataBlock
 * @class
 * @example
 * ``` js
 *  let dataBlock = new DataBlock({
 *    key: 'WERTHFVBN',
 *    })
 * ```
 */
export default class DataBlock implements DataBlocksInterface {
  constructor(options: DataBlocksOptions) {
    const { key = '', api = '' } = options

    let defOpt: Partial<DataBlocksInterface> = { keyType: 'block', showGroupInfo: false, showSysField: false }

    if (!key) {
      throw new Error('Key param can not be null')
    }

    if (!api) {
      throw new Error('Api param can not be null')
    }

    this.getAdapterRequest = this.getAdapterRequest.bind(this)
    this.get = this.get.bind(this)
    this.getBlock = this.getBlock.bind(this)
    this.getKv = this.getKv.bind(this)

    Object.assign(this, { ...defOpt }, { ...options })
  }
  key: string
  api: string
  keyType?: 'kv' | 'block' = 'block'
  taro?: any
  getAdapterRequest = async <T>(axiosParams: AxiosRequestConfig) => {
    // 判断是否为小程序环境
    let data
    if (process?.env?.TARO_ENV && this.taro) {
      // Taro小程序环境
      let params = { ...axiosParams, header: axiosParams.headers } // 重命名
      let res: { data: T } = await this.taro.request(params).catch((err) => {
        console.error(err)
        throw err
      })
      data = res.data
    } else {
      let axios = require('axios')
      let res: AxiosResponse<T> = await axios.request(axiosParams).catch((err) => {
        console.error(err)
        throw err
      })
      data = res.data
    }

    return data as Promise<T>
  }

  /**
   * 小程序可以直接存、取对象
   * @param name {string}
   * @param options {DataBlocksOptions} // 1000 = 1000ms  = 1s ；   //参考 https://day.js.org/docs/en/manipulate/add
   */
  get = async <T extends BaseT>(codes: string | string[], options?: DataBlocksOptions) => {
    if (!codes || !codes.length) {
      throw new Error('Codes can not be null')
    }
    let opts = Object.assign(this, { ...options }) as DataBlocksInterface
    let { key, api, keyType } = opts

    let url = api + '/' + keyType

    if (!Array.isArray(codes)) {
      codes = codes.split(',')
    }

    let requestOptions: AxiosRequestConfig = {
      url: url + '/' + codes.join(','),
      method: 'get',
      headers: { [APP_OPEN_KEY]: key },
    }

    let axRes = await this.getAdapterRequest<{ data: Record<string, T> }>(requestOptions)

    let tar = axRes.data

    if (keyType === 'block') {
      return distDataBlock<T>(tar, opts)
    }
    return tar
  }

  /**
   * 获取Block
   * @param name {string}
   * @param options {DataBlocksOptions} // 1000 = 1000ms  = 1s ；   //参考 https://day.js.org/docs/en/manipulate/add
   */
  getBlock = async <T extends BaseT>(codes: string | string[], options?: DataBlocksOptions) => {
    var opt: DataBlocksOptions = { ...options, keyType: 'block' }
    return this.get<T>(codes, opt)
  }

  /**
   * 获取Kv
   * @param name {string}
   * @param options {DataBlocksOptions} // 1000 = 1000ms  = 1s ；   //参考 https://day.js.org/docs/en/manipulate/add
   */
  getKv = async <T extends BaseT>(codes: string | string[], options?: DataBlocksOptions) => {
    return this.get<T>(codes, { ...options, keyType: 'kv' })
  }
}
