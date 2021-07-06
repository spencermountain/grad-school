const byRow = function (root) {
  let rows = []
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

const fillDown = function (root) {
  let props = root.props || {}
  const doit = node => {
    props = Object.assign({}, props, node.props)
    node.props = props
    node.children.forEach(doit)
  }
  doit(root)
}

export { byRow, fillDown }
