import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'

import tailwindPrefixPlugin from './scripts/tailwind/prefix-plugin.js'
import TailwindContentPlugin from './scripts/tailwind/tailwind-content-plugin.js'

import isPrefix from './scripts/tailwind/prefix.env.js'

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      TanStackRouterVite({ autoCodeSplitting: true }),
      viteReact(),
      tailwindcss(),
      ...(isPrefix(mode)
        ? [tailwindPrefixPlugin('tw:'), TailwindContentPlugin()]
        : []), // ✅ only in prod
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
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
      minify: true,
    },
  }
})
