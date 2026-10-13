/**
 * Static export build — used by Cloudflare Pages (and any plain static host).
 *
 *   npm run build         → normal Next.js build (Vercel, or any Node host)
 *   npm run build:static  → this script: the same site as plain HTML files
 *                           in the `out/` folder.
 *
 * It only turns on STATIC_EXPORT and runs the standard Next.js build, so one
 * source produces both outputs. No extra dependencies.
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const env = { ...process.env, STATIC_EXPORT: 'true' };

// Prefer the Next.js binary that is installed in this project (works with npm,
// pnpm and yarn). Fall back to npx if it cannot be found.
const localNext = join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next');

const child = existsSync(localNext)
  ? spawn(process.execPath, [localNext, 'build'], { stdio: 'inherit', env })
  : spawn('npx', ['next', 'build'], { stdio: 'inherit', env, shell: true });

child.on('exit', (code) => {
  if (code === 0) {
    console.log('\n✓ Static export complete — the ready-to-upload site is in the "out" folder.');
  }
  process.exit(code ?? 1);
});
