import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'

import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'

import tailwindcss from '@tailwindcss/vite'

import tailwindPrefixPlugin from './prefix-plugin';



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    // viteReact({
    //   babel: {
    //     plugins: [tailwindPrefix],
    //   },
    // }),
    tailwindcss(),
    // tailwindcss({
    //   content: ['./testfiles/tailwind-classes.tsx'],
    // }),
    tailwindPrefixPlugin('tw:'),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': {},
    process: JSON.stringify({ env: {} }),
  },
  build: {
    outDir: 'dist/digitalwoods-react.module',
    lib: {
      entry: 'src/main.tsx',
      name: 'ReactButtonModule',
      fileName: () => 'module.js',
      formats: ['iife'],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        assetFileNames: 'module.css',
      },
    },
    minify: false
  },
})
