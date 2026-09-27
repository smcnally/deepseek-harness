import { defineConfig } from 'tsdown'

/** Bundles the tsc-emitted `lib/types` output this package declares as `main`. */
export default defineConfig({
  entry: ['lib/types/index.js'],
  outDir: 'lib',
  format: ['esm'],
  platform: 'node',
  target: 'es2024',
  fixedExtension: false,
  dts: false,
  clean: false,
})
