# @zaxjs/data-block
Data block javascript package

# Use
``` js
import { DataBlock } from '@zaxjs/data-block'

let dataBlock=new DataBlock({api:"http://localhost:8089/data-block-service-api/v1/open", key:"Y2wwemk4aWtnMDAwMjA4bDQ4c3VrZzB5bA=="}) // 建议配置为全局单例对象
const resBlock = await dataBlock.getBlock([ "TEST_BLOCK" ], { showSysField: false , ttl: '5m', showGroupInfo:false, }).catch((err) => {
  console.error('dataBlock.getBlock', [ "TEST_BLOCK" ], err)
  throw err
})

if (resBlock?.length) {
  // code
}

const resKv = await dataBlock.getKv([ "TEST_BLOCK" ], { showSysField: false , ttl: '5m', showGroupInfo:false, }).catch((err) => {
  console.error('dataBlock.getKv', [ "TEST_BLOCK" ], err)
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