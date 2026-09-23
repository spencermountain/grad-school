import byDepth from '../crawl/crawl.js'

const toArray = function (json) {
  let nodes = byDepth(json)
  nodes = nodes.map(node => {
    node = Object.assign({}, node)
    delete node.children //no-longer needed
    let parents = node._cache.parents
    node.parent = parents.length ? parents[parents.length - 1] : null
    delete node._cache
    return node
  })
  // should we show the root?
  let root = nodes[0]
  if (root && !root.id && Object.keys(root.props).length === 0) {
    nodes.shift()
  }
  return nodes
}
export default toArray
