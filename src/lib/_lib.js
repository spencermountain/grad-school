const isArray = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

const parsePointer = function (str) {
  str = str || ''
  if (typeof str !== 'string') {
    return str
  }
  str = str.replace(/^\//, '')
  let arr = str.split(/\//)
  return arr
}

const getByPointer = function (node, str) {
  let ptr = parsePointer(str)
  for (let i = 0; i < ptr.length; i += 1) {
    let found = node.children.find(obj => obj.id === ptr[i])
    if (!found) {
      return null
    }
    node = found
  }
  return node
}

const normalize = str => {
  str = str || ''
  str = str.trim()
  return str
}
export { normalize, getByPointer, isArray }
