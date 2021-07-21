import parse from './parse.js'
import View from './View.js'

const grad = function (txt) {
  let data = {}
  if (typeof txt === 'string') {
    data = parse(txt)
  } else {
    data = txt || data
  }
  // start constructing from data
  return new View(data)
}
export default grad
