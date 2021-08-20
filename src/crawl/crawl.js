// [a, b, a1, b1]
const getBreadth = root => {
  let list = []
  let queue = [root]
  while (queue.length > 0) {
    // get first
    let node = queue.shift()
    // add to list
    list.push(node)
    // add kids to queue
    node.children.forEach(n => {
      // n._cache.parents = node._cache.parents + 1
      queue.push(n)
    })
  }
  return list
}

// [a, a1, b, b1]
const getDepth = root => {
  let list = []
  let queue = [root]
  while (queue.length > 0) {
    // get first
    let node = queue.pop()
    node._cache = node._cache || { parents: [] }
    // add to list
    list.push(node)
    // add kids to queue
    if (node.children) {
      node.children.forEach(n => {
        n._cache = n._cache || { parents: [] }
        node._cache = node._cache || { parents: [] }
        node._cache.parents = node._cache.parents || []
        n._cache.parents = node._cache.parents.concat([node.id])
        queue.push(n)
      })
    }
  }
  return list
}

export { getBreadth, getDepth }
