/* eslint-disable no-console */
import terser from '@rollup/plugin-terser'
import fs from 'node:fs'

const pkg = JSON.parse(fs.readFileSync('./package.json').toString())
console.log('\n 📦  - running rollup..\n')

const banner = `/* spencermountain/${pkg.name} ${pkg.version} ${pkg.license} */`

export default [
  // === Main ==
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: 'builds/grad-school.cjs', format: 'umd', name: 'gradSchool' }],
    plugins: [terser()],
  },
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: 'builds/grad-school.mjs', format: 'esm' }],
    plugins: [terser()],
  },
]
