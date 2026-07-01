import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // three.js (lazy-loaded only on the Mago page) is inherently ~500kB minified;
    // it's already code-split from the main bundle, so raise the warning threshold
    // instead of further fragmenting a single vendor library.
    chunkSizeWarningLimit: 600,
  },
})
