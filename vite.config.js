import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  config: {
    moment: {
      noGlobal: true
    }
  },
  build: {
    outDir: './dist'
  }
})
