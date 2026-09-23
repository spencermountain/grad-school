import test from 'tape'
import grad from '../src/index.js'

test('input format tests', function (t) {
  const rows = [
    { id: 'a', parent: null },
    { id: 'b', parent: null },
    { id: 'a1', parent: 'a' },
    { id: 'a2', parent: 'a' },
    { id: 'a21', parent: 'a2' },
  ]

  const nested = {
    children: [
      {
        id: 'a',
        children: [{ id: 'a1' }, { id: 'a2', children: [{ id: 'a21' }] }],
      },
      { id: 'b' },
    ],
  }

  const str = `
a
    a1
    a2
        a21
b
`
  const rowG = grad(rows)
  const nestG = grad(nested)
  const strG = grad(str)
  t.equal(rowG.out('text'), nestG.out('text'), 'row-is-equal')
  t.equal(strG.out('text'), nestG.out('text'), 'str-is-equal')
  t.end()
})
