const isComment = /^ *(#|\/\/)/

const indentLevel = str => {
  const reg = /^(  |\t)/
  let indent = 0
  while (reg.test(str)) {
    str = str.replace(reg, '')
    indent += 1
  }
  return indent
}

const parseOne = function (str) {
  str = str.trim()
  if (!str) {
    return null
  }
  if (/^\[/.test(str) && /\]$/.test(str)) {
    str = str.replace(/^\[/, '')
    str = str.replace(/\]$/, '')
    let list = str.split(/,/)
    list = list.map(s => s.trim()).filter(s => s)
    list = list.map(label => {
      return { label: label, children: [] }
    })
    return list
  }
  return [{ label: str, children: [] }]
}

// a -> a1 -> a2
const parseLine = function (str) {
  let split = str.trim().split(/->/)
  let list = []
  split.forEach(s => {
    list = list.concat(parseOne(s))
  })
  list = list.filter(s => s)
  let node = list[0]
  for (let i = 1; i < list.length; i += 1) {
    node.children.push(list[i])
    node = list[i]
  }
  return list[0]
}

const byIndent = function (list) {
  // add them to nth child
  let root = { children: [] }
  list.forEach((o, i) => {
    if (o.indent === 0) {
      // add it to the root
      root.children = root.children.concat(o.node)
    } else if (list[i - 1]) {
      let before = list[i - 1]
      let lastNode = before.node
      // add it to the deepest node last line
      lastNode.children.push(o.node)
    }
  })
  return root
}

const parse = function (txt) {
  let lines = txt.split(/\r?\n/)
  let list = []
  lines.forEach(line => {
    if (!line.trim() || isComment.test(line)) {
      return
    }
    let indent = indentLevel(line)
    list.push({ indent: indent, node: parseLine(line) })
  })
  let root = byIndent(list)
  return root
}
export default parse
