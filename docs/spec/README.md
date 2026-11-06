# Thư Mục Tài Liệu Đặc Tả Kỹ Thuật (System Specifications)

Thư mục này chứa toàn bộ các bản đặc tả kỹ thuật chi tiết của dự án **The Dev's Pixel Room (3D Isometric Interactive Portfolio)**.

## Danh Mục Các Bản Đặc Tả

1. [**00. Tổng Quan Kiến Trúc & Phân Rã Chức Năng**](./00-system-architecture.md)
   - Tổng quan kiến trúc hệ sinh thái, Tech Stack, nguyên tắc thiết kế kỹ thuật, bản đồ phân rã chức năng.
2. [**01. Phân Hệ 3D Scene, Ánh Sáng & Nhân Vật**](./01-core-3d-scene.md)
   - Không gian Isometric 3D, OrbitControls, 4 kịch bản ánh sáng (Morning, Sunset, Rainy, Night), Post-processing, Raycasting tương tác và nhân vật Pixel autonomous.
3. [**02. Phân Hệ Portfolio OS & Quản Lý Nội Dung**](./02-portfolio-os-panels.md)
   - Hệ điều hành giả lập Windows 95, quản lý cửa sổ kéo/thả/resize, Projects, Skills Matrix, About Me, Reading Shelf, Contact Form qua EmailJS.
4. [**03. Phân Hệ TV Retro Arcade & Mini Games**](./03-tv-arcade-games.md)
   - Kết xuất Canvas 2D lên 3D TV Screen, 4 mini games (Snake, Pong, Dino Run, Tetris), Gamepad ảo cho Mobile, điểm cao và Supabase Leaderboard.
5. [**04. Phân Hệ Âm Thanh & Máy Phát Nhạc Lo-Fi**](./04-audio-music-player.md)
   - Máy đĩa than vinyl 3D xoay thực tế, Floating Mini Spotify Player, Lo-Fi playlist, Sound Effects Engine (clicks, hovers, meows, camera).
6. [**05. Phân Hệ Tiện Ích Tương Tác & Easter Eggs**](./05-easter-eggs-utilities.md)
   - Studio Polaroid Lightbox với hiệu ứng 3D Parallax Tilt, In-Game Photo Mode chụp WebGL canvas, Kanban Board kéo thả, Sổ lưu bút Guestbook, Chú mèo tương tác.
7. [**06. Phân Hệ HUD, Điều Hướng & Đa Ngôn Ngữ**](./06-hud-navigation-i18n.md)
   - Floating HUD Capsule, điều hướng thời tiết, hệ thống song ngữ VI/EN (i18next), Preloading tài nguyên và Cinematic Welcome.
8. [**07. Phân Hệ Admin CMS & Tầng Dữ Liệu Data Service**](./07-admin-data-service.md)
   - Cổng quản trị Admin CMS bảo mật, CRUD Projects/Skills/Playlist/Guestbook, tầng DataService tích hợp Supabase Cloud và LocalStorage offline fallback.

