import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

mkdirSync('dist', { recursive: true });
await build({
  entryPoints: ['src/main.tsx'], bundle: true, format: 'esm', target: 'es2022',
  outfile: 'dist/hero.js', minify: true, jsx: 'automatic',
  loader: { '.svg': 'dataurl', '.png': 'dataurl' },
  define: { 'process.env.NODE_ENV': '"production"' },
});
execFileSync(process.execPath, ['node_modules/@tailwindcss/cli/dist/index.mjs', '-i', 'input.css', '-o', 'dist/hero.css', '--minify'], { stdio: 'inherit' });
// Scope the kit's root tokens to the shadow host; all component styles remain intact.
const css = readFileSync('dist/hero.css', 'utf8').replaceAll(':root', ':host');
writeFileSync('dist/hero.css', css);
