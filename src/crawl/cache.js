// [a, a1, b, b1]
const cache = root => {
  let list = []
  let queue = [root]
  while (queue.length > 0) {
    // get first
    let node = queue.pop()
    // add to list
    list.push(node)
    // add kids to queue
    if (node.children) {
      node.children.forEach(n => {
        if (node.id) {
          node._cache.parents = node._cache.parents || []
          n._cache.parents = node._cache.parents.concat([node.id])
        }
        queue.push(n)
      })
    }
  }
  return list
}
export default cache
