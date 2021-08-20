import { byDepth } from '../crawl/crawl.js'

const toArray = function (json) {
  let nodes = byDepth(json)
  nodes.forEach(node => {
    node = Object.assign({}, node)
    delete node.children //no-longer needed
    // delete node._cache
    // delete node.props
  })
  // should we show the root?
  let root = nodes[0]
  if (root && !root.id && Object.keys(root.props).length === 0) {
    nodes.shift()
  }
  return nodes
}
export default toArray
