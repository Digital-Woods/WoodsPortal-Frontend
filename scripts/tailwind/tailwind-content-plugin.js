import tailwindContent from './tailwind-content.js'

export default function TailwindContentPlugin() {
  return {
    name: 'vite-tailwind-content',
    apply: 'serve',
    async buildStart() {
      await tailwindContent()
    },
    async handleHotUpdate({ file }) {
      // ❌ ignore changes inside .temp (to avoid infinite loop)
      if (file.includes('.temp')) return

      if (/\.(tsx|jsx|css)$/.test(file)) {
        await tailwindContent()
      }
    },
  }
}
