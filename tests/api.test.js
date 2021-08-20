import test from 'tape'
import grad from '../src/index.js'

test('add/remove', function (t) {
  let str = `
a -> a1
b -> b1 -> b11
`
  const g = grad(str)
  t.equal(g.nodes().length, 6, 'origin-5')

  g.get('b').add('b2')
  t.equal(g.nodes().length, 7, 'now-more')

  g.remove('a')
  t.equal(g.nodes().length, 5, 'remove-top')

  g.get('b').remove('b1')
  t.equal(g.nodes().length, 3, 'remove-mid')

  t.end()
})

test('depth', function (t) {
  let g = grad('')
  t.equal(g.depth(), 0, 'no-depth')

  g = grad('foo')
  t.equal(g.depth(), 1, 'one-depth')

  g = grad('foo -> bar')
  t.equal(g.depth(), 2, 'two-depth')

  g = grad('foo -> bar -> baz')
  t.equal(g.depth(), 3, 'three-depth')

  let str = `
foo -> bar -> baz
b -> sdf
    `
  g = grad(str)
  t.equal(g.depth(), 3, 'still-three')
  t.end()
})
