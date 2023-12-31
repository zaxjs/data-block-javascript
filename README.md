# @zaxjs/data-block
Data block javascript package

# Use
``` js
import { DataBlock } from '@zaxjs/data-block'

// 建议配置为全局单例对象
let dataBlock=new DataBlock({api:"{{API}}", key:"{{KEY}}"}) 

const resBlock = await dataBlock.block([ "TEST_BLOCK" ], { showSysField: false , ttl: '5m', showGroupInfo:false,  }).catch((err) => {
  console.error('dataBlock.block', [ "TEST_BLOCK" ], err)
  throw err
})

if (resBlock?.length) {
  // code
}

const resKv = await dataBlock.kv([ "TEST_BLOCK" ], { showSysField: false , ttl: '5m', showGroupInfo:false,  }).catch((err) => {
  console.error('dataBlock.kv', [ "TEST_BLOCK" ], err)
  throw err
})

if (resKv?.length) {
  // code
}
```

## APIs
[API文档](https://github.com/zaxjs/data-block-javascript/tree/main/docs)

## Test Case
[测试用例](https://github.com/zaxjs/data-block-javascript/blob/main/__tests__/index.spec.ts)

## Coverage

| Statements                  | Branches                | Functions                 | Lines             |
| --------------------------- | ----------------------- | ------------------------- | ----------------- |
| ![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-100%25-brightgreen.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg?style=flat) |