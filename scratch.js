import Grad from './src/index.js'

let g = new Grad()

g.add('a')
g.add('b').add(['b1', 'b2'])
g.add('c')
g.add('d')
// g.add('e').add('e1').add('e11').add('e111').add(['e111a', 'e111b', 'e111c', 'e111d'])

console.log(g.out('ascii'))
