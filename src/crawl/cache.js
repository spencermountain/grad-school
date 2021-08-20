import byDepth from './crawl.js'

const cache = root => {
  byDepth(root, (parent, child) => {
    if (parent.id) {
      parent._cache.parents = parent._cache.parents || []
      child._cache.parents = parent._cache.parents.concat([parent.id])
    }
  })
}

// [a, a1, b, b1]
// const cache = root => {
//   let list = []
//   let queue = [root]
//   while (queue.length > 0) {
//     // get first
//     let node = queue.pop()
//     // add to list
//     list.push(node)
//     // add kids to queue
//     if (node.children) {
//       node.children.forEach(child => {
//         if (node.id) {
//           node._cache.parents = node._cache.parents || []
//           child._cache.parents = node._cache.parents.concat([node.id])
//         }
//         queue.push(child)
//       })
//     }
//   }
//   return list
// }
export default cache
