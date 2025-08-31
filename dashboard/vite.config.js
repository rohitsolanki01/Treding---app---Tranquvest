import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],  // 👈 make sure assets load under /dashboard
  server: {
    host: "0.0.0.0",
    port: 5174, // only used in local dev
  },
})
