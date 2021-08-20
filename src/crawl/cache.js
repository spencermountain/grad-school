import byDepth from './crawl.js'

const cache = root => {
  byDepth(root, (parent, child) => {
    if (parent.id) {
      parent._cache.parents = parent._cache.parents || []
      child._cache.parents = parent._cache.parents.concat([parent.id])
    }
  })
}
export default cache
