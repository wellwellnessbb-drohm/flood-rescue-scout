import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadEnv } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const outDir = path.resolve(projectRoot, 'dist');
const env = loadEnv(process.env.NODE_ENV ?? 'production', projectRoot, '');
const apiKey = env.GEMINI_API_KEY ?? '';

async function bundle(entry, outfile, define = {}) {
  await build({
    entryPoints: [entry],
    outfile,
    bundle: true,
    platform: 'browser',
    format: 'esm',
    sourcemap: false,
    target: 'es2022',
    define,
  });
}

async function bundleScripts() {
  const define = {
    'process.env.API_KEY': JSON.stringify(apiKey),
    'process.env.GEMINI_API_KEY': JSON.stringify(apiKey),
  };

  await bundle(
    path.resolve(projectRoot, 'background.ts'),
    path.resolve(outDir, 'background.js'),
    define,
  );

  await bundle(
    path.resolve(projectRoot, 'content.ts'),
    path.resolve(outDir, 'content.js'),
  );
}

function copyStaticFiles() {
  for (const file of ['manifest.json', 'metadata.json']) {
    const source = path.resolve(projectRoot, file);
    const destination = path.resolve(outDir, file);
    fs.copyFileSync(source, destination);
  }
}

async function run() {
  console.log('Running post-build tasks...');
  await bundleScripts();
  copyStaticFiles();
  console.log('Post-build tasks completed.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});





