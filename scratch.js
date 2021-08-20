import grad from './src/index.js'
// import fromText from './src/parse/from-text.js'

// let str = `
// a -> a2
//       -> a21
//   -> a1
// `

// let rows = [
//   { id: 'a', parent: null },
//   { id: 'b', parent: null },
//   { id: 'a1', parent: 'a' },
//   { id: 'a2', parent: 'a' },
//   { id: 'a21', parent: 'a2' },
// ]

const input = `
b
a
    a2
        a21
    a1
`
let g = grad(input).debug()
// console.log(g.out('flat'))
