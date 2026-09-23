import test from 'tape'
import source from '../src/index.js'
import esm from '../builds/grad-school.mjs'
import cjs from '../builds/grad-school.cjs'

for (const [format, grad] of Object.entries({ source, esm, cjs })) {
  test(`${format}: cyclic input is rejected`, t => {
    const self = { id: 'self', children: [] }
    self.children.push(self)
    t.throws(() => grad(self), /cyclic input/, 'nested self-cycle')
    const a = { id: 'a', children: [] }
    const b = { id: 'b', children: [a] }
    a.children.push(b)
    t.throws(() => grad({ children: [a] }), /cyclic input/, 'nested multi-node cycle')
    t.throws(() => grad([{ id: 'a', parent: 'a' }]), /cyclic input/, 'flat self-cycle')
    const rows = [
      { id: 'root' },
      { id: 'a', parent: 'b' },
      { id: 'b', parent: 'c' },
      { id: 'c', parent: 'a' },
    ]
    const before = JSON.stringify(rows)
    t.throws(() => grad(rows), /cyclic input/, 'disconnected flat cycle')
    t.equal(JSON.stringify(rows), before, 'rejected input is not mutated')
    t.end()
  })

  test(`${format}: cycle checks accept valid shared and deep inputs`, t => {
    const shared = { id: 'shared' }
    const g = grad({ children: [
      { id: 'a', children: [shared] },
      { id: 'b', children: [shared] },
    ] })
    t.equal(g.get('a/shared').found, true, 'shared node is not a cycle')
    t.equal(g.get('b/shared').found, true)
    t.equal(grad([]).children.length, 0)
    t.equal(grad({}).children.length, 0)
    const rows = []
    let nested = { id: '0' }
    for (let i = 1; i <= 10000; i += 1) {
      rows.push({ id: String(i - 1), parent: String(i) })
      nested = { id: String(i), children: [nested] }
    }
    rows.push({ id: '10000' })
    t.equal(grad(nested).list().length, 10001, 'deep nested input avoids recursion')
    t.equal(grad(rows).list().length, 10002, 'deep child-first flat input')
    t.end()
  })

  test(`${format}: subtree flat exports have no external parent`, t => {
    const g = grad('a -> b -> c')
    const b = g.get('a/b')
    const expected = [
      { id: 'b', props: {}, parent: null },
      { id: 'c', props: {}, parent: 'b' },
    ]
    t.deepEqual(b.out('flat'), expected, 'fresh subtree export')
    g.out('text')
    g.cache()
    const rows = b.out('flat')
    t.deepEqual(rows, expected, 'cached ancestors stay outside the export')
    t.equal(grad(rows).get('b/c').found, true, 'subtree round trip')
    t.deepEqual(b.json._cache.parents, ['a'], 'export preserves ancestor cache')
    t.equal(g.out('flat')[1].parent, 'a', 'full graph keeps its parent links')
    t.equal(g.get('a/b/c').out('flat')[0].parent, null, 'leaf export')
    t.end()
  })

  test(`${format}: common indentation is normalized`, t => {
    const expected = grad('a\n  b\nc').out('flat')
    for (const input of [
      '\n  a\n    b\n  c\n',
      '\n\ta\n\t\tb\n\tc\n',
      '# comment\n[]\n->\n    a\n      b\n    c\n',
      '\r\n  a\r\n    b\r\n  c\r\n',
    ]) {
      t.deepEqual(grad(input).out('flat'), expected)
    }
    t.deepEqual(grad('\n  # comment\n  []\n').out('flat'), [])
    t.end()
  })

  test(`${format}: incompatible inherited values preserve child overrides`, t => {
    const values = [new Set(['parent']), ['parent'], { parent: true }, true, false, 0, '', null]
    for (const parent of values) {
      for (const child of values) {
        // Matching collection types have their own merge assertions below.
        if (parent === child) continue
        const g = grad('a -> b')
        g.props({ value: parent })
        g.get('a').props({ value: child })
        g.fillDown()
        t.deepEqual(g.get('a').json.props.value, child, 'child override is preserved')
      }
    }
    const g = grad('a -> b')
    g.props({ set: new Set(['parent']), array: ['parent'], object: { parent: true, shared: 'parent' } })
    g.get('a').props({ set: new Set(['child']), array: ['child'], object: { child: true, shared: 'child' } })
    g.fillDown()
    const props = g.get('a/b').json.props
    t.deepEqual(props.set, new Set(['child', 'parent']))
    t.deepEqual(props.array, ['parent', 'child'])
    t.deepEqual(props.object, { parent: true, child: true, shared: 'child' })
    t.end()
  })

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
