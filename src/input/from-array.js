import validate from './_validate.js'

// turn parent-index rows into nested json
const fromArray = function (rows) {
  let index = new Map()
  rows = rows.map(node => validate({ ...node, children: [] }))
  rows.forEach(node => {
    index.set(node.id, node)
  })
  let root = validate({})
  rows.forEach(node => {
    if (node.parent) {
      if (index.has(node.parent)) {
        let parent = index.get(node.parent)
        delete node.parent //no-longer needed
        parent.children.push(node)
      } else {
        console.warn(`[Grad] - missing node '${node.parent}'`) // eslint-disable-line
      }
      return
    }
    // no parent, add it to root
    root.children.push(node)
  })
  return root
}
export default fromArray
