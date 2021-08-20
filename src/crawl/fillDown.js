// [a, a1, b, b1]
const fillDown = root => {
  let list = []
  let queue = [root]
  while (queue.length > 0) {
    // get first
    let node = queue.pop()
    // add to list
    list.push(node)
    // add kids to queue
    node.children.forEach(n => {
      // n._cache.parents = node._cache.parents + 1
      n.props = Object.assign({}, node.props, n.props)
      queue.push(n)
    })
  }
  return list
}
export default fillDown
