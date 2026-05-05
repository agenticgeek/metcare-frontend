import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  /** Same-origin `/api` in dev so httpOnly cookies work (see README on API / CORS). */
  const devApiTarget = env.VITE_DEV_API_PROXY ?? process.env.VITE_DEV_API_PROXY ?? 'http://127.0.0.1:5001'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
    },
    server: {
      proxy: {
        '/api': {
          target: devApiTarget,
          changeOrigin: true,
          secure: devApiTarget.startsWith('https'),
          cookieDomainRewrite: { '*': 'localhost' },
        },
      },
    },
  }
})
