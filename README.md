# The Dev's Pixel Room

Ngon ngu: Tieng Viet | [English](README.en.md)

Portfolio cá nhân dạng phòng pixel 3D tương tác, xây dựng với React + Three.js.

Live demo: https://letrongnghia.me

## Ảnh căn phòng

| Buổi sáng | Buổi tối |
| --- | --- |
| ![Căn phòng buổi sáng](https://res.cloudinary.com/dackig67m/image/upload/v1773484649/room_cog0h6.png) | ![Căn phòng buổi tối](https://res.cloudinary.com/dackig67m/image/upload/v1773484649/dark_room_ietpe7.png) |

## Tổng quan

Project tái hiện một căn phòng isometric 3D, nơi mỗi object là một điểm tương tác:

- PC mở Projects (Portfolio OS kiểu Windows 95)
- Plan Board mở Skills
- TV mở khu game retro
- Bed mở Contact (form EmailJS)
- Window đổi Day/Night với hiệu ứng transition
- Cat là easter egg
- Record Player mở music player phát nhạc nền

## Tính năng chính

- 3D Room realtime với React Three Fiber + Drei
- Portfolio OS (desktop window manager) cho phần dự án
- 4 mini games trong TV: Snake, Pong, Dino Run, Tetris
- Music player kiểu mini Spotify (playlist, progress, volume, queue)
- Polaroid lightbox gallery
- Kanban overlay
- Đa ngôn ngữ VI/EN bằng i18next
- Responsive + touch controls cho mobile (D-pad khi chơi game)
- Lưu preference bằng localStorage (day/night, string lights)
- Vercel Analytics tracking sự kiện tương tác

## Công nghệ sử dụng

- React 18
- Vite 5
- Three.js + @react-three/fiber + @react-three/drei
- @react-three/postprocessing
- Zustand
- i18next + react-i18next
- Tailwind CSS
- EmailJS
- Vercel Analytics

## Yêu cầu môi trường

- Node.js 18 trở lên (khuyến nghị LTS mới)
- npm 9 trở lên

## Cài đặt và chạy local

1. Cài dependencies:

   npm install

2. Tạo file .env (hoặc .env.local) ở root project:

   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_USER_ID=your_public_key

3. Chạy dev server:

   npm run dev

4. Build production:

   npm run build

5. Preview bản build:

   npm run preview

## Scripts

- npm run dev: chạy môi trường development
- npm run build: build production bằng Vite
- npm run preview: preview bản build local
- npm run lint: chạy ESLint
- npm run deploy: build và deploy dist lên nhánh gh-pages
- npm run analyze: build kèm report bundle

## Deploy

### 1) Vercel (khuyến nghị)

Repo đã có sẵn file vercel.json với:

- rewrite về index.html cho SPA routing
- cache headers cho assets
- security headers cơ bản

Chỉ cần import repository vào Vercel và deploy.

### 2) GitHub Pages

1. Bật GitHub Pages cho nhánh gh-pages
2. Chạy lệnh deploy:

   npm run deploy

Lưu ý:

- vite.config.js hiện dùng base: /
- Nếu deploy dưới subpath (không phải domain root), cần đổi base tương ứng

## Cấu trúc thư mục chính

src/
- components/Room: toàn bộ scene 3D, object tương tác, game engine
- components/UI: overlays, HUD, music player, loading, lightbox
- components/PortfolioOS: giao diện desktop/terminal cho phần project
- data: dữ liệu portfolio, playlist, images, books
- i18n: config và bản dịch vi/en
- store: Zustand state trung tâm
- utils: hooks tiện ích (mobile detection, sounds, lazy components)

api/
- music/: thư mục dành cho API nhạc (hiện đang để trống)

scripts/
- download-music.js: script hỗ trợ tải nhạc local bằng yt-dlp

## Tùy biến nội dung

- Cập nhật thông tin cá nhân và project tại src/data/portfolio.js
- Cập nhật playlist tại src/data/playlist.js
- Cập nhật bản dịch tại:
  - src/i18n/locales/vi/common.json
  - src/i18n/locales/en/common.json

## Lưu ý kỹ thuật

- Để tránh cảnh báo tương thích với stack 3D hiện tại, giữ three ở mức 0.170.x.
- Contact form cần đủ 3 biến môi trường EmailJS; thiếu biến sẽ gửi mail thất bại.
- Trình duyệt mobile có thể chặn autoplay audio cho đến khi user tương tác lần đầu.

