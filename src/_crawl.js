const byRow = function (root, start) {
  let rows = []
  // root.size = size
  // root.start = start
  // divide-up the size
  // size = Math.floor(size / (root.children.length || 1))

  const doit = function (node, x, y, size) {
    node.x = x
    node.y = y
    node.size = size
    rows[y] = rows[y] || []
    rows[y].push(node)
    let div = Math.floor(size / (node.children.length || 1))
    node.children.forEach((child, i) => {
      let left = i * div
      doit(child, x + left, y + 1, div)
    })
  }
  doit(root, 0, 0, 100)
  return rows
}
const byCol = function (root) {}
export { byRow, byCol }
