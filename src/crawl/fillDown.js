const isObject = function (item) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

const isArray = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}
// recursive merge of objects
function mergeDeep(props = {}, parent = {}) {
  Object.keys(parent).forEach(k => {
    // ignore null
    if (!parent[k]) {
      return
    }
    // merge an object
    if (isObject(parent[k])) {
      props[k] = Object.assign({}, parent[k], props[k] || {})
      return
    }
    //  concat an array
    if (isArray(parent[k])) {
      props[k] = parent[k].concat(props[k])
    }
    // just overwrite it
    props[k] = parent[k]
  })
  return props
}

// [a, a1, b, b1]
const fillDown = root => {
  let list = []
  let queue = [root]
  while (queue.length > 0) {
    // get first
    let node = queue.pop()
    // add to list
    list.push(node)
    // add kids to queue
    node.children.forEach(child => {
      child.props = mergeDeep(child.props, node.props)
      queue.push(child)
    })
  }
  return list
}
export default fillDown
