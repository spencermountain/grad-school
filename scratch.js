import grad from './src/index.js'

let str = `
a -> a1
b -> b1 -> b11
`

let g = grad(str)
let found = g.get('a') || {}

console.log(found)
// const a = g.get('a').props({ foo: ['ayy'] })
// a.get('a2').props({ yeah: true })
// g.fillDown()
// console.dir(g.out('array'), { depth: 15 })
// console.log(g.out('flat'))
