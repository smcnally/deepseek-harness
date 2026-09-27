import { defineConfig } from 'tsdown'

/**
 * Bundles the compiled `lib/types` output this vendored package vendors for
 * the harness.
 *
 * tsdown loads a workspace package's config with `stopAt` set to the parent of
 * the workspace glob, so a config above `vendor/` is unreachable and an absent
 * package-local config leaves the entry unresolved — aborting the whole
 * workspace build. The sibling vendored packages (loader, schemastery,
 * logger-console) carry their own configs for the same reason.
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
