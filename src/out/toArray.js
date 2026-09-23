import byDepth from '../crawl/crawl.js'

const toArray = function (json) {
  let nodes = byDepth(json)
  nodes = nodes.map((node, i) => {
    node = Object.assign({}, node)
    delete node.children //no-longer needed
    const parents = node._cache.parents
    node.parent = i > 0 && parents.length > 0 ? parents[parents.length - 1] : null
    return node
  })
  // should we show the root?
  const root = nodes[0]
  if (root && !root.id && Object.keys(root.props).length === 0) {
    nodes.shift()
  }
  return nodes
}
export default toArray
