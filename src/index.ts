/**
 * DataBlock Module
 * @module @zaxjs/data-block
 * @see https://github.com/zaxjs/data-block-javascript/blob/main/docs/README.md
 */

import { AxiosRequestConfig, AxiosResponse } from 'axios'

const APP_OPEN_KEY = `x-data-block-openkey`

type TKv = {
  blockStatus?: any
  sysId?: any
  createdBy?: any
  createdAt?: any
  updatedBy?: any
  updatedAt?: any
  publishedBy?: any
  publishedAt?: any
  description?: any
  syncAt?: any
}

type TBlock = {
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

/* istanbul ignore next */
export const distDataBlock = <T extends TBlock>(res: Record<string, T>, opt: Partial<DataBlocksOptions>): Record<string, T> => {
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

/* istanbul ignore next */
export const distDataKv = <T extends TKv>(res: Record<string, T>, opt: Partial<DataBlocksOptions>): Record<string, T> => {
  let { showSysField } = opt

  if (!res) {
    console.log('Pass nothing')
    return null as any
  }

  var resAll = Object.values(res)
  // 应用类型，源数据一并delete

  resAll.map((item) => {
    if (!showSysField) {
      delete item?.blockStatus
      delete item?.sysId
      delete item?.createdBy
      delete item?.createdAt
      delete item?.updatedBy
      delete item?.updatedAt
      delete item?.publishedBy
      delete item?.publishedAt
      delete item?.description
      delete item?.syncAt
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
  getBlock: <T extends TBlock>(codes: string | string[], options?: DataBlocksOptions) => Promise<Record<string, T> | null>
  block: <T extends TBlock>(codes: string | string[], options?: DataBlocksOptions) => Promise<Record<string, T> | null>
  getKv: <T extends TKv>(codes: string | string[], options?: DataBlocksOptions) => Promise<Record<string, T> | null>
  kv: <T extends TKv>(codes: string | string[], options?: DataBlocksOptions) => Promise<Record<string, T> | null>
  _get: <T extends TBlock | TKv>(codes: string | string[], options?: DataBlocksOptions) => Promise<Record<string, T> | null>
  _getAdapterRequest: <T>(opts: AxiosRequestConfig) => Promise<T>
}

export type DataBlocksOptions = Partial<Omit<DataBlocksInterface, '_get' | 'getBlock' | 'getKv' | 'block' | 'kv' | '_getAdapterRequest'>>

/**
 * Create a DataBlock
 * @class
 * @example
 * ``` js
 *  let dataBlock = new DataBlock({
 *    api: 'WERTHFVBN',
 *    key: 'WERTHFVBN',
 *    keyType:'block',
 *    })
 * ```
 */
export default class DataBlock implements DataBlocksInterface {
  /* istanbul ignore next */
  constructor(options: DataBlocksOptions) {
    const { key = '', api = '' } = options

    let defOpt: Partial<DataBlocksInterface> = { showGroupInfo: false, showSysField: false }

    if (!key) {
      /* istanbul ignore next */
      throw new Error('Key param can not be null')
    }

    if (!api) {
      /* istanbul ignore next */
      throw new Error('Api param can not be null')
    }

    // inner method
    this._getAdapterRequest = this._getAdapterRequest.bind(this)
    this._get = this._get.bind(this)

    // open member
    this.block = this.block.bind(this)
    this.kv = this.kv.bind(this)

    // deprecated
    this.getBlock = this.getBlock.bind(this)
    this.getKv = this.getKv.bind(this)

    Object.assign(this, { ...defOpt }, { ...options })
  }
  key: string
  api: string
  keyType?: 'kv' | 'block'
  taro?: any
  _getAdapterRequest = async <T>(axiosParams: AxiosRequestConfig) => {
    // 判断是否为小程序环境
    let data: T
    /* istanbul ignore next */
    if (process?.env?.TARO_ENV && this.taro) {
      // Taro小程序环境
      let params = { ...axiosParams, header: axiosParams.headers } // 重命名
      let res: { data: T } = await this.taro.request(params).catch((err: any) => {
        console.error(err)
        throw err
      })
      data = res.data
    } else {
      let axios = require('axios')
      let res: AxiosResponse<T> = await axios.request(axiosParams).catch((err: any) => {
        console.error(err)
        throw err
      })
      data = res.data
    }

    return data
  }

  /**
   * 小程序可以直接存、取对象
   * @param name {string}
   * @param options {DataBlocksOptions} // 1000 = 1000ms  = 1s ；   //参考 https://day.js.org/docs/en/manipulate/add
   */
  _get = async <T extends TBlock | TKv>(codes: string | string[], options?: DataBlocksOptions) => {
    /* istanbul ignore next */
    if (!codes || !codes.length) {
      throw new Error('Codes can not be null')
    }
    /* istanbul ignore next */
    if (!options?.keyType) {
      throw new Error('KeyType can not be null')
    }
    let opts = Object.assign(this, { ...options }) as DataBlocksOptions
    let { key, api, keyType } = opts

    let url = api + '/' + keyType

    if (!Array.isArray(codes)) {
      codes = codes.split(',')
    }

    /* istanbul ignore next */
    let requestOptions: AxiosRequestConfig = {
      url: url + '/' + codes.join(','),
      method: 'get',
      headers: {
        [APP_OPEN_KEY]: key || '',
      },
    }

    let axRes = await this._getAdapterRequest<{ data: Record<string, T> }>(requestOptions)

    let tar = axRes.data

    /* istanbul ignore next */
    if (keyType === 'block') {
      return distDataBlock<T>(tar, opts)
    } else if (keyType === 'kv') {
      return distDataKv<T>(tar, opts)
    }
    /* istanbul ignore next */
    return null
  }

  /**
   * 获取Block
   * @deprecated
   * @param name {string}
   * @param options {DataBlocksOptions} // 1000 = 1000ms  = 1s ；   //参考 https://day.js.org/docs/en/manipulate/add
   */
  getBlock = async <T extends TBlock>(codes: string | string[], options?: DataBlocksOptions) => {
    var opt: DataBlocksOptions = { ...options, keyType: 'block' }
    return this._get<T>(codes, opt)
  }

  /**
   * 获取Block
   * @param name {string}
   * @param options {DataBlocksOptions} // 1000 = 1000ms  = 1s ；   //参考 https://day.js.org/docs/en/manipulate/add
   */
  block = async <T extends TBlock>(codes: string | string[], options?: DataBlocksOptions) => {
    var opt: DataBlocksOptions = { ...options, keyType: 'block' }
    return this._get<T>(codes, opt)
  }

  /**
   * 获取Kv
   * @deprecated
   * @param name {string}
   * @param options {DataBlocksOptions} // 1000 = 1000ms  = 1s ；   //参考 https://day.js.org/docs/en/manipulate/add
   */
  getKv = async <T extends TKv>(codes: string | string[], options?: DataBlocksOptions) => {
    return this._get<T>(codes, { ...options, keyType: 'kv' })
  }

  /**
   * 获取Kv
   * @param name {string}
   * @param options {DataBlocksOptions} // 1000 = 1000ms  = 1s ；   //参考 https://day.js.org/docs/en/manipulate/add
   */
  kv = async <T extends TKv>(codes: string | string[], options?: DataBlocksOptions) => {
    return this._get<T>(codes, { ...options, keyType: 'kv' })
  }
}
