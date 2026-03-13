import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['.trycloudflare.com'],
    port: 3000,
    hmr: mode === 'development'
      ? { /* defaults — no clientPort override for local dev */ }
      : { clientPort: 443 },
    proxy: {
      '/api': {
        target: mode === 'development'
          ? 'http://localhost:8000'
          : 'https://api.golosshoes.shop',
        changeOrigin: true,
        secure: mode !== 'development',
      }
    }
  }
}))
