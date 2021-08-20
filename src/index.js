import parse from './parse/index.js'
import View from './View.js'

const grad = function (input) {
  let data = {}
  if (typeof input === 'string') {
    data = parse(input)
  } else {
    data = input || data
  }
  // start constructing from data
  return new View(data)
}

export default grad
