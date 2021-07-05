import out from './out.js'

const isArray = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

class Node {
  constructor(label, parent) {
    this.label = label || ''
    this.parents = []
    this.children = []
    if (parent) {
      this.parents.push(parent)
    }
  }
  add(label) {
    if (isArray(label)) {
      label.forEach(str => this.add(str))
      return this
    }
    let node = new Node(label, this)
    this.children.push(node)
    return node
  }
  out() {
    return out(this)
  }
}

export default Node
