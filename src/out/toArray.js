import { byDepth } from '../crawl/crawl.js'

const toArray = function (json) {
  let nodes = byDepth(json)
  nodes.forEach(node => {
    delete node.children //no-longer needed
    // delete node._cache
    delete node.props
  })
  return nodes
}
export default toArray
