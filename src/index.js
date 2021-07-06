import out from './out.js'
import { fillDown } from './_crawl.js'
import { normalize, getByPointer, isArray } from './_lib.js'
const hasSlash = /\//

class Node {
  constructor(label, props = {}, parent) {
    this.label = normalize(label)
    this.parents = []
    this.children = []
    this.props = props
    if (parent) {
      this.parents.push(parent)
    }
  }
  get(label) {
    label = normalize(label)
    if (!hasSlash.test(label)) {
      // lookup by label name
      return this.children.find(obj => obj.label === label)
    }
    return getByPointer(this, label)
  }
  add(label, props = {}) {
    if (isArray(label)) {
      label.forEach(str => this.add(normalize(str), props))
      return this
    }
    let node = new Node(label, props, this)
    this.children.push(node)
    return node
  }
  remove(label) {
    if (!label) {
      // remove self
      let me = this.label
      let parent = this.parents[0]
      parent.children = parent.children.filter(obj => obj.label === me)
      return parent
    }
    // remove child
    label = normalize(label)
    this.children = this.children.filter(obj => obj.label !== label)
    return this
  }
  fillDown() {
    fillDown(this)
    return this
  }
  out() {
    return out(this)
  }
}

export default Node
