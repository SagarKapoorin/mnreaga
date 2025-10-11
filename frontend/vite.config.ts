import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteImagemin from 'vite-plugin-imagemin'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add this plugin
    // Optimize images and SVGs at build time (disabled when SKIP_IMAGEMIN=true)
    ...(process.env.SKIP_IMAGEMIN === 'true'
      ? []
      : [
          viteImagemin({
            gifsicle: { optimizationLevel: 7 },
            optipng: { optimizationLevel: 7 },
            mozjpeg: { quality: 80 },
            pngquant: { quality: [0.7, 0.9] },
            svgo: {
              plugins: [
                { name: 'removeViewBox' },
                { name: 'removeDimensions' },
              ],
            },
          }),
        ]),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@typings': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@config': path.resolve(__dirname, './src/config'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
