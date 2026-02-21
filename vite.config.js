// vite.config.js
// Proxy disabled: frontend calls Odoo directly (VITE_API_BASE=http://127.0.0.1:8076)
// To use proxy instead, uncomment the proxy block and set VITE_API_BASE="" or remove it
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {}
})
