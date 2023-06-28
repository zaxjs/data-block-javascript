/**
 * DataBlock Module
 * data-block
 * @see https://github.com/zaxjs/data-block-javascript/blob/main/docs/README.md
 */

import { AxiosRequestConfig, AxiosResponse } from 'axios'

type TKv = {
  k?: string // 核心，误删
  v?: any // 核心，误删
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
  description?: any
}

/* istanbul ignore next */
export const distData = <T extends TBlock>(res: Record<string, T>, opt: Partial<DataBlocksOptions>): Record<string, T> => {
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
      delete sub?.description
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
  /**
   * show system field
   */
  showSysField?: boolean
  /**
   * show groun info
   */
  showGroupInfo?: boolean
  /**
   * local server cache time
   * @see https://day.js.org/docs/en/manipulate/add
   */
  ttl?: `${number}${'d' | 'h' | 'm' | 's'}`
  keyType?: 'kv' | 'block'
  taro?: any
  /**
   * 获取Kv
   * @deprecated
   */
  getBlock: <T extends TBlock>(codes: string | string[], options?: DataBlocksOptions) => Promise<Record<string, T> | null>
  block: <T extends TBlock>(codes: string | string[], options?: DataBlocksOptions) => Promise<Record<string, T> | null>
  /**
   * 获取Kv
   * @deprecated
   */
  getKv: <T extends TKv>(codes: string | string[], options?: DataBlocksOptions) => Promise<Record<string, T> | null>
  kv: <T extends TKv>(codes: string | string[], options?: DataBlocksOptions) => Promise<Record<string, T> | null>
  _get: <T extends TBlock | TKv>(codes: string | string[], options?: DataBlocksOptions) => Promise<Record<string, T> | null>
  _getAdapterRequest: <T>(opts: AxiosRequestConfig) => Promise<T>
}

export type DataBlocksOptions = Partial<Omit<DataBlocksInterface, '_get' | 'getBlock' | 'getKv' | 'block' | 'kv' | '_getAdapterRequest'>>

/**
 * DataBlock Module
 * @class
 * @module DataBlock
 * @example
 * ```typescript
 *  let dataBlock = new DataBlock({
 *    api: 'WERTHFVBN',
 *    key: 'WERTHFVBN',
 *    keyType: 'block',
 *  })
 * ```
 */
export default class DataBlock implements DataBlocksInterface {
  /**
   * Creates an instance of DataBlock.
   * @constructor
   * @param {DataBlocksOptions} options - Options for DataBlock.
   */
  constructor(options: DataBlocksOptions) {
    const { key = '', api = '' } = options

    let defOpt: Partial<DataBlocksInterface> = { showGroupInfo: false, showSysField: false }

    if (!key) {
      /**
       * Throws an error if the `key` parameter is null.
       * @throws Error
       */
      throw new Error('Key param cannot be null')
    }

    if (!api) {
      /**
       * Throws an error if the `api` parameter is null.
       * @throws Error
       */
      throw new Error('Api param cannot be null')
    }

    this._getAdapterRequest = this._getAdapterRequest.bind(this)
    this._get = this._get.bind(this)
    this.block = this.block.bind(this)
    this.kv = this.kv.bind(this)
    this.getBlock = this.getBlock.bind(this)
    this.getKv = this.getKv.bind(this)

    Object.assign(this, { ...defOpt }, { ...options })
  }
  showSysField?: boolean | undefined
  showGroupInfo?: boolean | undefined
  ttl?: `${number}d` | `${number}h` | `${number}m` | `${number}s` | undefined

  /**
   * The key of the DataBlock.
   * @member {string}
   */
  key: string

  /**
   * The API of the DataBlock.
   * @member {string}
   */
  api: string

  /**
   * The key type of the DataBlock (kv or block).
   * @member {("kv" | "block")}
   */
  keyType?: 'kv' | 'block'

  /**
   * Taro instance (for Taro environments).
   * @member {any}
   */
  taro?: any

  private _getAdapterRequest = async <T>(axiosParams: AxiosRequestConfig) => {
    let data: T

    if (process?.env?.TARO_ENV && this.taro) {
      // Taro小程序环境
      let params = { ...axiosParams, header: axiosParams.headers }
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
   * Retrieves data from the DataBlock.
   * @private
   * @param {string | string[]} codes - Codes to retrieve.
   * @param {DataBlocksOptions} options - Options for data retrieval.
   * @returns {Promise<TBlock | TKv | Record<string, TBlock | TKv>>} - Retrieved data.
   * @throws Error
   */
  private _get = async <T extends TBlock | TKv>(codes: string | string[], options?: DataBlocksOptions) => {
    const APP_OPEN_KEY = `x-data-block-openkey`
    if (!codes || !codes.length) {
      throw new Error('Codes cannot be null')
    }

    if (!options?.keyType) {
      throw new Error('KeyType cannot be null')
    }

    let opts = Object.assign(this, { ...options }) as DataBlocksOptions
    let { key, api, keyType } = opts
    let url = api + '/' + keyType

    if (!Array.isArray(codes)) {
      codes = codes.split(',')
    }

    let requestOptions: AxiosRequestConfig = {
      url: url + '/' + codes.join(','),
      method: 'get',
      headers: {
        [APP_OPEN_KEY]: key || '',
      },
    }

    let axRes = await this._getAdapterRequest<{ data: Record<string, T> }>(requestOptions)
    let tar = axRes.data

    if (keyType === 'block' || keyType === 'kv') {
      return distData<T>(tar, opts)
    }

    return tar
  }

  /**
   * Retrieves block data from the DataBlock.
   * @member {string}
   * @param {string | string[]} codes - Block codes to retrieve.
   * @param {DataBlocksOptions} options - Options for block retrieval.
   * @returns {Promise<Record<string, TBlock> | null>} - Retrieved block data.
   */
  block = async <T extends TBlock>(codes: string | string[], options?: DataBlocksOptions) => {
    var opt: DataBlocksOptions = { ...options, keyType: 'block' }
    return this._get<T>(codes, opt)
  }

  /**
   * Retrieves block data from the DataBlock. (Deprecated: Use `block` method instead)
   * @deprecated
   * @param {string | string[]} codes - Block codes to retrieve.
   * @param {DataBlocksOptions} options - Options for block retrieval.
   * @returns {Promise<Record<string, TBlock> | null>} - Retrieved block data.
   */
  getBlock = async <T extends TBlock>(codes: string | string[], options?: DataBlocksOptions) => {
    return this.block<T>(codes, options)
  }

  /**
   * Retrieves key-value data from the DataBlock.
   * @member {string}
   * @param {string | string[]} codes - Key codes to retrieve.
   * @param {DataBlocksOptions} options - Options for key-value retrieval.
   * @returns {Promise<Record<string, TKv> | null>} - Retrieved key-value data.
   */
  kv = async <T extends TKv>(codes: string | string[], options?: DataBlocksOptions) => {
    return this._get<T>(codes, { ...options, keyType: 'kv' })
  }

  /**
   * Retrieves key-value data from the DataBlock. (Deprecated: Use `kv` method instead)
   * @deprecated
   * @param {string | string[]} codes - Key codes to retrieve.
   * @param {DataBlocksOptions} options - Options for key-value retrieval.
   * @returns {Promise<Record<string, TKv> | null>} - Retrieved key-value data.
   */
  getKv = async <T extends TKv>(codes: string | string[], options?: DataBlocksOptions) => {
    return this.kv<T>(codes, options)
  }
}
