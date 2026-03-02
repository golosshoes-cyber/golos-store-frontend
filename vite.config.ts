import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['.trycloudflare.com'],
    port: 3000,
    hmr: {
      clientPort: 443,
    },
    proxy: {
      '/api': {
        target: 'https://api.golosshoes.shop',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})

