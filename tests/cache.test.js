import test from 'tape'
import grad from '../src/index.js'

test('cacheDown', function (t) {
  const str = `
a -> a1
b -> b1 -> b11
`
  const g = grad(str)
  g.cache()
  // let nodes = g.out('flat')
  const b1 = g.get('b/b1')
  t.equal(b1.json._cache.children.length, 1, 'mid-child')
  t.equal(b1.json._cache.parents.length, 1, 'mid-child')
  const b = g.get('b')
  t.equal(b.json._cache.children.length, 2, 'top-child')
  t.equal(b.json._cache.parents.length, 0, 'top-child')
  const end = g.get('b/b1/b11')
  t.equal(end.json._cache.children.length, 0, 'top-child')
  t.equal(end.json._cache.parents.length, 2, 'top-child')
  t.end()
})
