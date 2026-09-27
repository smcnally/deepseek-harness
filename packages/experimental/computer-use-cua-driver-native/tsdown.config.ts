import { defineConfig } from 'tsdown'

/**
 * Bundles the tsc-emitted `lib/types` output this package declares as its
 * \`main\` (see package.json).
 *
 * tsdown resolves each workspace package's config locally, so a package without
 * its own config never contributes a bundle: its declared entry stays
 * unresolved and consumers fail with "Failed to resolve entry". Packages that
 * ship a tsdown.config.ts already follow this pattern.
 */
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
