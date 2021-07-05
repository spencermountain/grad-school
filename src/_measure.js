// http://tobyho.com/2011/10/15/getting-terminal-size-in-node/
const getSize = function () {
  return { width: process.stdout.columns, height: process.stdout.rows }
}

const dimensions = function (root) {
  let maxX = 0
  let maxY = 0

  const doit = function (node, x, y) {
    if (x > maxX) {
      maxX = x
    }
    if (y > maxY) {
      maxY = y
    }
    if (node.children) {
      node.children.forEach((child, w) => {
        doit(child, x + w, y + 1)
      })
    }
    return
  }
  doit(root, 0, 0)
  return { depth: maxY, breadth: maxX }
}

const measure = function (rood) {
  let { width } = getSize()
  let res = dimensions(rood)
  res.width = width
  return res
}
export default measure
