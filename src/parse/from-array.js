// turn parent-index rows into nested json
const flatJson = function (rows) {
  let index = {}
  rows.forEach(node => {
    index[node.id] = node
    node.children = node.children || []
  })
  let root = {
    children: [],
  }
  rows.forEach(node => {
    if (node.parent) {
      if (index.hasOwnProperty(node.parent)) {
        let parent = index[node.parent]
        parent.children.push(node)
      } else {
        console.warn(`[Grad] - missing node '${node.parent}'`)
      }
      return
    } else {
      // no parent add it to root
      root.children.push(node)
    }
  })
  return root
}
export default flatJson
