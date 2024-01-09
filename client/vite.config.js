import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

// https://vitejs.dev/config/  
export default defineConfig({
  root: path.join(__dirname, 'src'),
  server:{
    proxy:{
      // '/api': 'http://localhost:3000'   can't use this becuase it's not secure each time you /api add http://localhost:3000 at beginning
      '/api':{
        target: 'http://localhost:3000',
        secure:false,
      },
    },
  },
  build: { manifest: true, outDir: './dist'},
  base:  '/',
  root: './src',
  plugins: [react()],
})


