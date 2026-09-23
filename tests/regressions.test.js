import test from 'tape'
import source from '../src/index.js'
import esm from '../builds/grad-school.mjs'
import cjs from '../builds/grad-school.cjs'

for (const [format, grad] of Object.entries({ source, esm, cjs })) {
  test(`${format}: added siblings have independent properties`, t => {
    const g = grad('')
    g.add(['a', 'b'])
    g.get('a').props({ onlyA: true })
    t.deepEqual(g.get('b').json.props, {})
    const props = { shared: true }
    g.add(['c', 'd'], props)
    g.get('c').props({ onlyC: true })
    t.deepEqual(g.get('d').json.props, { shared: true })
    t.deepEqual(props, { shared: true }, 'caller properties are preserved')
    t.end()
  })

  test(`${format}: depth is relative to the selected node`, t => {
    const g = grad('a -> b -> c')
    const b = g.get('a/b')
    t.equal(b.depth(), 2)
    g.out('text')
    t.equal(b.depth(), 2, 'ancestor caches do not affect depth')
    t.deepEqual(b.json._cache.parents, ['a'], 'depth does not rewrite caches')
    g.cache()
    t.equal(b.depth(), 2)
    t.equal(g.depth(), 3)
    t.equal(g.get('a/b/c').depth(), 1, 'a named leaf has depth one')
    t.equal(grad('').depth(), 0)
    t.end()
  })

  test(`${format}: traversal preserves sibling order`, t => {
    const g = grad('a\n  a1\n  a2\nb\nc')
    const ids = ['a', 'a1', 'a2', 'b', 'c']
    t.deepEqual(g.nodes().slice(1).map(node => node.id), ids)
    t.deepEqual(g.out('flat').map(node => node.id), ids)
    const restored = grad(g.out('flat'))
    t.deepEqual(restored.children.map(node => node.id), ['a', 'b', 'c'])
    t.deepEqual(restored.get('a').children.map(node => node.id), ['a1', 'a2'])
    t.equal(restored.out('text'), g.out('text'))
    t.deepEqual(g.children.map(node => node.id), ['a', 'b', 'c'], 'traversal does not reorder input')
    t.end()
  })

  test(`${format}: empty expressions and tab comments are skipped`, t => {
    t.equal(grad('->\n[]\n  ->\n  []').depth(), 0)
    const g = grad('a\n  ->\n  []\n\t# comment\n\t// comment\n  b\nc')
    t.deepEqual(g.nodes().slice(1).map(node => node.id), ['a', 'b', 'c'])
    t.equal(g.get('a/b').found, true, 'skipped lines preserve indentation context')
    t.end()
  })

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
