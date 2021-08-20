import { getDepth } from '../crawl/crawl.js'
import c from '../lib/color.js'

const toText = function (json, color) {
  const indent = '    '
  let arrow = '-> '
  if (color) {
    arrow = c.dim('→ ')
  }
  let txt = ''
  let rows = getDepth(json)
  rows.forEach((node, i) => {
    let label = node.id || ''
    if (color) {
      label = c.red(label)
    }
    if (i === 0 && !node.id) {
      return //skip empty root
    }
    let depth = node._cache.parents.length - 1
    txt += indent.repeat(depth) + arrow + label + '\n'
  })
  return txt
}
export default toText
