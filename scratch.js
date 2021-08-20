import grad from './src/index.js'

let str = `
a -> a1
b -> b1 -> b11
`

let g = grad(str)
g.get('a').props({ list: new Set(['fromA', 'also']) })
g.props({ list: new Set(['fromRoot']) })
g.fillDown()
console.log(g.get('a/a1').json)
// let a1 = a.get('a1')
// console.dir(g.json, { depth: 15 })

// console.log(g.out('array'))

// let b = grad(g.out('text'))
// console.log('=-=-=-= here -=-=-=-')
// console.log(b.out('text'))
// console.log(found)
// const a = g.get('a').props({ foo: ['ayy'] })
// a.get('a2').props({ yeah: true })
// g.fillDown()
// console.dir(g.out('array'), { depth: 15 })
// console.log(g.out('flat'))
