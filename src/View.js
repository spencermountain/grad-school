import out from './out/index.js'
import { normalize, getByPointer } from './lib/_lib.js'
import { byDepth } from './crawl/crawl.js'
import cache from './crawl/cache.js'
import fillDown from './crawl/fillDown.js'
const hasSlash = /\//
import validate from './input/_validate.js'

class View {
  constructor(json = {}) {
    cache(json)
    Object.defineProperty(this, 'json', {
      enumerable: false,
      value: json,
      writable: true,
    })
  }
  get children() {
    return this.json.children
  }
  get id() {
    return this.json.id
  }
  get found() {
    return this.json.id || this.children.length > 0
  }
  props(input = {}) {
    let props = this.json.props || {}
    if (typeof input === 'string') {
      props[input] = true
    }
    this.json.props = Object.assign(props, input)
    return this
  }
  get(id) {
    id = normalize(id)
    if (!hasSlash.test(id)) {
      // lookup by label name
      let found = this.children.find(obj => obj.id === id)
      return new View(found)
    }
    let obj = getByPointer(this.json, id) || validate({})
    return new View(obj)
  }
  // add(label, props = {}) {
  //   if (isArray(label)) {
  //     label.forEach(str => this.add(normalize(str), props))
  //     return this
  //   }
  //   let node = new View(label, props, this)
  //   this.children.push(node)
  //   return node
  // }
  // remove(label) {
  //   if (!label) {
  //     // remove self
  //     let me = this.label
  //     let parent = this.parents[0]
  //     parent.children = parent.children.filter(obj => obj.label === me)
  //     return parent
  //   }
  //   // remove child
  //   label = normalize(label)
  //   this.children = this.children.filter(obj => obj.label !== label)
  //   return this
  // }
  nodes() {
    return byDepth(this.json)
  }
  cache() {
    byDepth(this.json)
    return this
  }
  list() {
    return byDepth(this.json)
  }
  fillDown() {
    fillDown(this.json)
    return this
  }
  out(fmt) {
    return out(this.json, fmt)
  }
  debug() {
    out(this.json, 'debug')
    return this
  }
}

export default View
