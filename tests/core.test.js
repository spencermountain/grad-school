import test from 'tape'
import { createRequire } from 'node:module'
import grad from 'grad-school'
import * as core from 'grad-school/core'

const require = createRequire(import.meta.url)

const rows = () => [
  { id: 'noun', props: { tags: ['noun'], inherited: true } },
  { id: 'person', parent: 'noun', props: { tags: ['person'] } },
  { id: 'name', parent: 'person', props: { inherited: false } }
]

for (const [format, api] of [['ESM', core], ['CommonJS', require('grad-school/core')]]) {
  test(`core public API (${format})`, t => {
    t.deepEqual(Object.keys(api).sort(), ['cache', 'fillDown', 'fromArray', 'toArray'], 'four exports')
    const graph = api.fromArray(rows())
    t.equal(api.cache(graph), undefined, 'cache mutates in place')
    t.equal(api.fillDown(graph), undefined, 'fillDown mutates in place')
    const result = api.toArray(graph)
    t.deepEqual(result, grad(rows()).cache().fillDown().out('array'), 'matches chainable API')
    t.deepEqual(result.map(row => row.parent), [null, 'noun', 'person'], 'preserves parents')
    t.deepEqual(result[0]._cache.children, ['person', 'name'], 'caches descendants')
    t.deepEqual(result[2]._cache.parents, ['noun', 'person'], 'caches ancestors')
    t.deepEqual(result[2].props.tags, ['noun', 'person'], 'inherits arrays through multiple levels')
    t.equal(result[2].props.inherited, false, 'preserves explicit child values')
    t.deepEqual(api.toArray(api.fromArray([])), [], 'supports empty input')
    t.throws(() => api.fromArray([
      { id: 'a', parent: 'b' },
      { id: 'b', parent: 'a' }
    ]), /cyclic input/i, 'rejects cycles')
    t.end()
  })
}

test('existing CommonJS entry point', t => {
  const gradCjs = require('grad-school')
  t.equal(typeof gradCjs, 'function', 'still exports a callable factory')
  t.deepEqual(gradCjs(rows()).cache().fillDown().out('array'),
    grad(rows()).cache().fillDown().out('array'), 'matches ESM default API')
  t.end()
})
