import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  '/api': 'https://port-0-shorts-saver-backend-m4lzhgqr0b9df7c3.sel4.cloudtype.app/',
})
