import out from './out.js'
import { fillDown } from './_crawl.js'
import { normalize, getByPointer } from './_lib.js'
import { getBreadth, getDepth } from './crawl.js'
const hasSlash = /\//

class View {
  constructor(json = {}) {
    Object.defineProperty(this, 'json', {
      enumerable: false,
      value: json,
      writable: true,
    })
  }
  get children() {
    return this.json.children
  }
  get label() {
    return this.json.label
  }
  get props() {
    return this.json.props || {}
  }
  set props(input) {
    this.json.props = this.json.props || {}
    let prop = this.json.props
    if (typeof input === 'string') {
      prop[input] = true
    }
    Object.assign(prop, input)
  }
  get(label) {
    label = normalize(label)
    if (!hasSlash.test(label)) {
      // lookup by label name
      let found = this.children.find(obj => obj.label === label)
      // console.log(this.children)
      return new View(found)
    }
    let obj = getByPointer(this, label)
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
  list() {
    return getDepth(this.json)
  }
  fillDown() {
    fillDown(this.json)
    return this
  }
  out() {
    return out(this.json)
  }
}

export default View
