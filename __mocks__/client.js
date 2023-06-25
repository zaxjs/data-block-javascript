// import { JSDOM } from "jsdom"
// const dom = new JSDOM()
// global.document = dom.window.document
// global.window = dom.window

const { JSDOM } = require('jsdom')

console.log('client loaded')

if (!global.Window) {
  Object.defineProperty(global, 'Window', {
    value: window.constructor,
    writable: true,
    enumerable: true,
    configurable: true,
  })
}
