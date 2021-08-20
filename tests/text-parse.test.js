import test from 'tape'
import grad from '../src/index.js'

test('parse/get tests', function (t) {
  let str = `
a -> a1
b -> b1 -> b11
`

  let g = grad(str)
  let found = g.get('a') || {}
  t.equal(found.id, 'a', 'got 1st child')
  t.equal(found.children.length, 1, 'one child')

  found = g.get('b/b1') || {}
  t.equal(found.id, 'b1', 'got 1-nested')
  t.equal(found.children.length, 1, 'b1 child')

  found = g.get('b/b1/b11') || {}
  t.equal(found.id, 'b11', 'got 2-nested')
  t.equal(found.children.length, 0, 'no b11 child')

  let a = g.get('a') || {}
  t.equal(a.id, 'a', 'got a')
  found = a.get('a1') || {}
  t.equal(found.id, 'a1', 'got a1')

  let b = g.get('b') || {}
  t.equal(b.id, 'b', 'got b')
  found = b.get('b1') || {}
  t.equal(found.id, 'b1', 'got b1')

  t.end()
})

test('parse/get tests', function (t) {
  let str = `
  // comment
a -> a1

# second comment
b -> b1 -> b11

`
  let g = grad(str)
  let list = g.list()
  t.equal(list.length, 6, 'get list')

  list = g.get('b').list()
  t.equal(list.length, 3, 'get sub-list')
  t.end()
})

test('fill-down', function (t) {
  let str = `
a
b -> b1
c -> c1 -> c2
`
  let g = grad(str)
  g.props = { isCool: true }
  let c1 = g.get('c/c1')
  c1.props = { isCool: false }
  g.fillDown()
  t.equal(g.get('b').props.isCool, true, 'b')
  t.equal(g.get('b/b1').props.isCool, true, 'b1')
  t.equal(g.get('c').props.isCool, true, 'c')
  t.equal(g.get('c/c1').props.isCool, false, 'c1')
  t.equal(g.get('c/c1/c2').props.isCool, false, 'c2')
  t.end()
})
