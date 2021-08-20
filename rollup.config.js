import { terser } from 'rollup-plugin-terser'
// import sizeCheck from 'rollup-plugin-filesize-check'

export default [
  // === Main ==
  {
    input: 'src/index.js',
    output: [{ file: 'builds/grad-school.cjs', format: 'umd', name: 'nlp' }],
    plugins: [terser()],
  },
  {
    input: 'src/index.js',
    output: [{ file: 'builds/grad-school.mjs', format: 'esm' }],
    plugins: [terser()],
  },
]
