import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

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
  plugins: [react()],
})
