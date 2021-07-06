**grad-school** is a tool for creating ad-hoc graphs, in a scripting language, and then querying them.

I have no idea how it's gonna work.

### Javascript API

```js
import Grad from 'grad-school'

let g = new Grad()

g.add('a')
g.add('b').add(['b1', 'b2'])
g.add('c')
g.add('d')
// g.add('e').add('e1').add('e11').add('e111').add(['e111a', 'e111b', 'e111c', 'e111d'])

g.get('/b/b1').remove()
console.log(g.get('b').children)

console.log(g.out('ascii'))
```

MIT
