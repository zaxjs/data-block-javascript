# data-block-javascript
Data block javascript package

# Use

import { DataBlock } from '@zaxjs/data-block'
... 
  let dataBlock=new DataBlock({api:"http://localhost:8089/data-block-service-api/v1/open, key:"Y2wwemk4aWtnMDAwMjA4bDQ4c3VrZzB5bA=="}) // 建议配置为全局单例对象
  const res = await dataBlock.getBlock([ "TEST_BLOCK" ], { showSysField: false , ttl: '5m', showGroupInfo:false, }).catch((err) => {
    console.error('dataBlock.get', [ "TEST_BLOCK" ], err)
    throw err
  })

  if (res?.length) {
    // code
  }
...
  

## APIs
[API文档](https://github.com/zaxjs/data-block-javascript/tree/main/docs)

## Test Case
[测试用例](https://github.com/zaxjs/data-block-javascript/blob/main/__tests__/index.spec.ts)