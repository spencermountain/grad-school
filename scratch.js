import grad from './src/index.js'

let str = `
a -> a1
b -> b1 -> b11
`

let g = grad(str)
g.props = { fun: true }
g.fillDown()
console.dir(g.json, { depth: 15 })
// console.log(g.list())
// g.add('a', { isA: true }).add(['a1', 'a2'])
// let b = g.add('b', { cool: true })
// b.add(['b1', 'b2'])
// g.add(['c', 'd'])

// g.props = { top: true }
// g.fillDown()
// g.get('b').remove('b1')
// console.log(g.get('/b/b2'))

console.log(g.out('ascii'))
