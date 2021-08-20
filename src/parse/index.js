import fromText from './from-text.js'
import fromArray from './from-array.js'

const isArray = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

// 3 fmts we support
const parse = function (input = []) {
  if (typeof input === 'string') {
    return fromText(input)
  }
  if (isArray(input)) {
    return fromArray(input)
  }
  return input
}
export default parse
