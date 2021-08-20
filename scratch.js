import grad from './src/index.js'
import parse from './src/parse/index.js'

let str = `
// a -> a1
// b -> b1 -> b11
c
  c1
  c2
    c2a
    c2b
`
// const data = parse(str)

let g = grad(str).debug()
console.dir(g.json, { depth: 15 })
g.cache()

// g.props = { fun: true }
// g.fillDown()
// console.dir(g.json, { depth: 15 })
// console.log(g.list())
// g.add('a', { isA: true }).add(['a1', 'a2'])
// let b = g.add('b', { cool: true })
// b.add(['b1', 'b2'])
// g.add(['c', 'd'])

// g.props = { top: true }
// g.fillDown()
// g.get('b').remove('b1')
// console.log(g.get('/b/b2'))

// console.log(g.out('ascii'))
