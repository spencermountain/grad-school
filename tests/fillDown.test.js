import test from 'tape'
import grad from '../src/index.js'

test('fulldown-basic', function (t) {
  let str = `
a -> a1
b -> b1 -> b11
`
  let g = grad(str)
  let rows = g.out('array')
  t.equal(rows.length, 5, '5 rows')

  // set prop on root
  g.props({ root: true })
  rows = g.out('array')
  t.equal(rows.length, 6, 'has root now')

  // not on leaf yet
  let leaf = g.get('b/b1/b11')
  t.equal(leaf.json.props.root, undefined, 'not there yet')

  g.fillDown()
  leaf = g.get('b/b1/b11')
  t.equal(leaf.json.props.root, true, 'there now')

  let a = g.get('a').props({ cool: true })
  a.fillDown()
  let a1 = a.get('a1')
  t.equal(a1.json.props.root, true, 'here too')
  t.equal(a1.json.props.cool, true, 'mid-to-down')
  t.equal(leaf.json.props.cool, undefined, 'not-cross')

  t.end()
})

test('fill-down array', function (t) {
  let str = `
a -> a1
b -> b1 -> b11
`
  let g = grad(str)
  g.get('a').props({ list: ['fromA', 'also'] })
  g.props({ list: ['fromRoot'] })
  g.fillDown()
  let have = g.get('b/b1/b11').json.props.list
  t.equal(have.length, 1, 'got one on b-side')

  have = g.get('a/a1').json.props.list
  t.equal(have.length, 3, 'got all 3 on a-side')
  t.end()
})

test('fill-down set', function (t) {
  let str = `
a -> a1
b -> b1 -> b11
`
  let g = grad(str)
  g.get('a').props({ list: new Set(['fromA', 'also']) })
  g.props({ list: new Set(['fromRoot']) })
  g.fillDown()
  let have = g.get('b/b1/b11').json.props.list
  t.equal(have.size, 1, 'got one on b-side')

  have = g.get('a/a1').json.props.list
  t.equal(have.size, 3, 'got all 3 on a-side')
  t.end()
})

test('fill-down key-val', function (t) {
  let str = `
a
b -> b1
c -> c1 -> c2
`
  let g = grad(str)
  g.props({ isCool: true })
  let c1 = g.get('c/c1')
  c1.props({ isCool: false })
  g.fillDown()
  t.equal(g.get('b').json.props.isCool, true, 'b')
  t.equal(g.get('b/b1').json.props.isCool, true, 'b1')
  t.equal(g.get('c').json.props.isCool, true, 'c')
  // should be false down here
  t.equal(g.get('c/c1').json.props.isCool, false, 'c1')
  t.equal(g.get('c/c1/c2').json.props.isCool, false, 'c2')
  t.end()
})
