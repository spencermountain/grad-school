import toText from './toText.js'
import toArray from './toArray.js'

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
    console.log(toText(root, true)) // eslint-disable-line
    return null
  }
  if (fmts.hasOwnProperty(label)) {
    return fmts[label](root)
  }
  return root
}
export default out
