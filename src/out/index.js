// import measure from './_measure.js'
// import { getDepth } from '../crawl.js'
// import { byRow } from '../lib/_crawl.js'

// const center = (txt = '', size) => {
//   size = size - 3
//   let halfWay = Math.floor(size / 2)
//   let oneSide = Math.floor(txt.length / 2)
//   let pad = ''.padEnd(halfWay - oneSide, '_')
//   return ` ${pad}${txt}${pad} `
// }

// const asciiVert = function (root) {
//   let { width, depth, breadth } = measure(root)
//   let rows = getDepth(root)
//   // console.log(rows)
//   let lines = []
//   rows.forEach(nodes => {
//     let size = Math.floor(width / nodes.length)
//     let row = ''
//     nodes.forEach(node => {
//       row += center(node.label, size)
//     })
//     lines.push(row)
//   })
//   return lines.join('\n')
// }

const fmts = {
  // ascii: asciiVert,
}

const out = function (root, label = 'ascii') {
  if (fmts.hasOwnProperty(label)) {
    return fmts[label](root)
  }
  return fmts['ascii'](root)
}
export default out
