/* eslint-disable no-console */
import terser from '@rollup/plugin-terser'
import fs from 'node:fs'
import sizeCheck from 'rollup-plugin-filesize-check'


const pkg = JSON.parse(fs.readFileSync('./package.json').toString())
console.log('\n 📦  - running rollup..\n')

const banner = `/* spencermountain/${pkg.name} ${pkg.version} ${pkg.license} */`

export default [
  // === Main ==
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: 'builds/grad-school.cjs', format: 'umd', name: 'gradSchool' }],
    plugins: [
      terser({ compress: { passes: 3 } }),
      sizeCheck({
        expect: 4, // sizes in kb
        warn: 4, // acceptable change (+/-)
        throw: 10 // unacceptable change (+/-)
      })
    ]
  },
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: 'builds/grad-school.mjs', format: 'esm' }],
    plugins: [terser({ compress: { passes: 3 } })]
  },
  {
    input: 'src/core.js',
    output: [
      { banner, file: 'builds/grad-school-core.mjs', format: 'esm' },
      { banner, file: 'builds/grad-school-core.cjs', format: 'cjs' }
    ],
    plugins: [terser({ compress: { passes: 3 } })]
  },
]
