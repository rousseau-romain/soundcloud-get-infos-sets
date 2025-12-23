#!/usr/bin/env node

/**
 * Build script for the SoundCloud extension
 * Bundles TypeScript modules into single files for browser compatibility
 */

const esbuild = require('esbuild');
const path = require('path');

const isWatch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: [
    'src/content.ts',
    'src/options.ts'
  ],
  bundle: true,
  outdir: 'dist',
  platform: 'browser',
  target: 'es2020',
  sourcemap: isWatch ? 'inline' : false,
  minify: !isWatch,
  logLevel: 'info'
};

async function build() {
  try {
    if (isWatch) {
      console.log('👀 Watching for changes...\n');
      const ctx = await esbuild.context(buildOptions);
      await ctx.watch();
    } else {
      console.log('🔨 Building extension...\n');
      await esbuild.build(buildOptions);
      console.log('\n✅ Build complete!');
    }
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
