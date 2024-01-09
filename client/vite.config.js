import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import laravel from 'laravel-vite-plugin';

// https://vitejs.dev/config/  
export default defineConfig({
  server:{
    proxy:{
      // '/api': 'http://localhost:3000'   can't use this becuase it's not secure each time you /api add http://localhost:3000 at beginning
      '/api':{
        target: 'http://localhost:3000',
        secure:false,
      },
    },
  },
  build: { manifest: true, outDir: 'build'},
  base:  '/',
  root: './src',
  plugins: [
    laravel([
      'resources/css/app.css',
      'resources/js/main.jsx',
  ]),
  ],
})


