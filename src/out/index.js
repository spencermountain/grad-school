import toText from './text.js'
import { getDepth } from '../crawl/crawl.js'

const toArray = function (json) {
  let nodes = []
  console.log(getDepth(json))
  return nodes
}

const fmts = {
  text: toText,
  txt: toText,
  array: toArray,
  flat: toArray,
}
const nested = {
  nested: true,
  json: true,
}

const out = function (root, label = 'ascii') {
  // return internal json
  if (nested.hasOwnProperty(label)) {
    return root
  }
  if (label === 'debug') {
    console.log(toText(root))
    return null
  }
  if (fmts.hasOwnProperty(label)) {
    return fmts[label](root)
  }
  return root
}
export default out