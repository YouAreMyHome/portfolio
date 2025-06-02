# Portfolio Website

Portfolio cá nhân được xây dựng bằng React, Vite và Tailwind CSS.

## 🚀 Deploy lên GitHub Pages

### Bước 1: Cấu hình Repository
1. Đẩy code lên GitHub repository
2. Vào Settings > Pages của repository
3. Chọn Source: "Deploy from a branch"
4. Chọn Branch: "gh-pages" và folder "/ (root)"

### Bước 2: Deploy tự động
```bash
npm run deploy
```

### Bước 3: Cấu hình domain tùy chỉnh (nếu có)
1. Trong Settings > Pages, thêm custom domain
2. Cập nhật `base` trong `vite.config.js`:
   - Nếu dùng domain riêng: `base: '/'`
   - Nếu dùng GitHub Pages: `base: '/tên-repository/'`

## 🛠️ Development

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview build
npm run preview

# Deploy lên GitHub Pages
npm run deploy
```

## 📁 Cấu trúc Project

```
src/
├── components/     # React components
├── pages/         # Trang routes
├── App.jsx        # Main app component
└── main.jsx       # Entry point
```

## 🌐 Live Demo

Website đã được deploy tại: `https://yourusername.github.io/portfolio/`

## 📝 Features

- ✅ Responsive design
- ✅ Dark/Light mode
- ✅ Game Cat Run tích hợp
- ✅ Clean URI Tool
- ✅ Portfolio showcase
- ✅ Contact form với EmailJS
