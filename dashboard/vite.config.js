import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5174, // local dev only
  },
  preview: {
    host: "0.0.0.0",
    port: process.env.PORT || 5173,
    allowedHosts: ["https://treding-app-tranquvest-3.onrender.com"], // allow Render domain
  }
})
