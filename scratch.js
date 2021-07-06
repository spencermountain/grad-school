import Grad from './src/index.js'

let g = new Grad()

g.add('a', { isA: true }).add(['a1', 'a2'])
let b = g.add('b', { cool: true })
// b.add(['b1', 'b2'])
// g.add(['c', 'd'])

g.props = { top: true }
g.fillDown()

console.log(b)

// g.get('b').remove('b1')
// console.log(g.get('/b/b2'))

// console.log(g.out('ascii'))
