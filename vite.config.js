import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isAnalyzeMode = mode === 'analyze';

  return {
    plugins: [
      react(),
      {
        name: 'add-nojekyll',
        writeBundle() {
          writeFileSync(resolve('dist/.nojekyll'), '');
        },
      },
    ],
    base: '/', // Sử dụng domain riêng letrongnghia.me
    resolve: {
      alias: {
        buffer: 'buffer',
      },
    },
    optimizeDeps: {
      include: ['lucide-react', 'zustand', 'buffer'],
      exclude: ['@react-three/postprocessing'],
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
        supported: {
          bigint: true,
        },
      },
    },
    build: {
      target: 'ES2020',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      reportCompressedSize: false,
      chunkSizeWarningLimit: 700, // Three.js core is ~650KB, cannot be split further
      rollupOptions: {
        plugins: isAnalyzeMode
          ? [
              visualizer({
                filename: 'dist/stats.html',
                gzipSize: true,
                brotliSize: true,
                open: false,
              }),
            ]
          : [],
        output: {
          manualChunks: {
            // Vendor chunks
            'vendor-react': ['react', 'react-dom'],
            'vendor-three': ['three'],
            'vendor-r3f': ['@react-three/fiber', '@react-three/drei'],
            'vendor-animation': ['gsap', 'framer-motion'],
            'vendor-state': ['zustand'],
          },
          // Add asset size limits
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/png|jpe?g|gif|svg|webp|ico/.test(ext)) {
              return `assets/img/[name]-[hash][extname]`;
            } else if (/woff|woff2|eot|ttf|otf/.test(ext)) {
              return `assets/fonts/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
        },
      },
    },
    server: {
      proxy: {
        // Tạo một tiền tố tùy ý, ví dụ '/api-cleanuri'
        // Mọi request đến '/api-cleanuri' trên dev server của bạn sẽ được proxy
        '/api-cleanuri': {
          target: 'https://cleanuri.com', // Server API đích
          changeOrigin: true, // Cần thiết cho các virtual hosted sites, thay đổi header "Origin" của request
          rewrite: (path) => path.replace(/^\/api-cleanuri/, ''), // Xóa tiền tố '/api-cleanuri' trước khi gửi request đến server đích
          // secure: false, // Nếu server đích dùng HTTPS với chứng chỉ tự ký (thường không cần cho API công cộng)
        },
        // Bạn có thể thêm các proxy khác ở đây nếu cần
      },
    },
  };
});