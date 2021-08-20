import fromText from './from-text.js'
import fromArray from './from-array.js'
import { byDepth } from '../crawl/crawl.js'
import validate from './_validate.js'

const isArray = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

const fromNested = function (json) {
  let rows = byDepth(json)
  rows.forEach(validate)
  return json
}

// 3 fmts we support
const parse = function (input = []) {
  if (typeof input === 'string') {
    return fromText(input)
  }
  if (isArray(input)) {
    return fromArray(input)
  }
  return fromNested(input)
}
export default parse
