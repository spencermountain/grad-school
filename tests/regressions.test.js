import test from 'tape'
import source from '../src/index.js'
import esm from '../builds/grad-school.mjs'
import cjs from '../builds/grad-school.cjs'

for (const [format, grad] of Object.entries({ source, esm, cjs })) {
  test(`${format}: unordered flat input and reserved IDs`, t => {
    const rows = [
      { id: 'child', parent: 'hasOwnProperty' },
      { id: 'hasOwnProperty', parent: '__proto__' },
      { id: '__proto__', parent: null },
    ]
    const before = JSON.stringify(rows)
    const g = grad(rows).cache()
    t.equal(g.get('__proto__/hasOwnProperty/child').id, 'child')
    t.deepEqual(g.get('__proto__').json._cache.children, ['hasOwnProperty', 'child'])
    t.equal(JSON.stringify(rows), before, 'input rows are preserved')
    t.end()
  })

  test(`${format}: flat output preserves parent relationships`, t => {
    const g = grad('a -> b -> c')
    const rows = g.out('flat')
    t.deepEqual(rows.map(node => [node.id, node.parent]), [
      ['a', null], ['b', 'a'], ['c', 'b'],
    ])
    t.ok(rows.every(node => !('children' in node) && !('_cache' in node)))
    t.equal(grad(rows).get('a/b/c').id, 'c', 'flat output can be parsed again')
    rows[0].id = 'changed'
    t.equal(g.get('a').id, 'a', 'output rows are copies')
    t.end()
  })

  test(`${format}: missing lookups and string props`, t => {
    const g = grad('a')
    t.equal(g.get('missing').found, false)
    t.equal(g.get('a/missing').found, false)
    t.equal(g.get('missing').get('child').found, false)
    t.equal(g.get('a').found, true)
    t.deepEqual(g.get('a').props('cool').json.props, { cool: true })
    t.end()
  })

  test(`${format}: cache refreshes after repeated calls and edits`, t => {
    const g = grad('a -> b')
    g.cache().cache()
    t.deepEqual(g.get('a').json._cache.children, ['b'])
    g.get('a').remove('b')
    g.cache()
    t.deepEqual(g.get('a').json._cache.children, [])
    t.deepEqual(g.json._cache.children, ['a'])
    g.get('a').add('c')
    g.cache()
    t.deepEqual(g.get('a').json._cache.children, ['c'])
    t.end()
  })
}
