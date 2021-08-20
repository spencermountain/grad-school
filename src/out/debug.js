import { getDepth } from '../crawl/crawl.js'
import c from '../lib/color.js'

const indent = '     '
const debug = function (json) {
  let rows = getDepth(json)
  rows.forEach((node, i) => {
    let label = c.red(node.id || '')
    if (i === 0 && !node.id) {
      return //skip empty root
    }
    console.log(indent.repeat(node._cache.parents) + c.dim('→ ') + label)
  })
}
export default debug
