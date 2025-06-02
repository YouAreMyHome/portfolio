import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'add-nojekyll',
      writeBundle() {
        writeFileSync(resolve('dist/.nojekyll'), '');
      }
    }
  ],
  base: '/', // Sử dụng domain riêng letrongnghia.me
  optimizeDeps: {
    exclude: ['lucide-react'],
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
});