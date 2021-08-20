**grad-school** is a tool for creating ad-hoc graphs, in a scripting language, and then querying them.

it's surprising how there's no super-clear way to author graph-data.

It always hurts my head. Even simple graphs do.

Maybe i have a head-problem, or maybe JSON is just an awkward way to think-about graphs.

library is like, 3kb.

### Ok, graphs:

This library supports 3 formats:

### String-format

this is a pretty-flexible way to declare a graph, using indents and `->` syntax. It's harder to add metadata to nodes.
It's a bit like how graphviz does it:

```js
let str = `
a -> a2
      -> a21
  -> a1
b
`
let g = grad(str).debug()
g.nodes().length // 5
```

### flat json:

this flat, parent-indexed json is easy to make, but the graph is harder to 'see':

```js
let nodes = [
  { id: 'a', parent: null },
  { id: 'b', parent: null },
  { id: 'a1', parent: 'a' },
  { id: 'a2', parent: 'a' },
  { id: 'a21', parent: 'a2' },
]
let g = grad(str).debug()
/*
  → a
      → a2
            → a21
      → a1
  → b
*/
```

### nested json:

this is how d3 does it:

```js
let nodes = {
  children: [
    {
      id: 'a',
      children: [{ id: 'a1' }, { id: 'a2', children: [{ id: 'a21' }] }],
    },
    { id: 'b' },
  ],
}
let g = grad(str).debug()
/*
  → a
      → a2
            → a21
      → a1
  → b
*/
```

## Javascript construction api

you can also easily mess-around with the graph:

```js
import Grad from 'grad-school'

let g = new Grad('a -> a1')

// add new nodes
g.add('b').add(['b1', 'b2'])
g.add('c')

// get a node by a json-pointer
g.get('/b/b1').remove()
console.log(g.get('b').children)

console.log(g.out())
```

MIT
