import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Load the private key and certificate
const httpsOptions = {
  key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem')),
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: httpsOptions,
    port: 3000,
    open: true,
    proxy: {
      '/graphql': {
        target: 'https://127.0.0.1:3001',
        secure: false, 
        changeOrigin: true,
        ws: true,
      }
    }
  }
});
