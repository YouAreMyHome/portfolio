# Tài Liệu Đặc Tả Hệ Thống (System Specification Overview)

> **Dự Án:** The Dev's Pixel Room (3D Isometric Interactive Portfolio)  
> **Tác Giả:** Lê Trọng Nghĩa  
> **Phiên Bản Tài Liệu:** 1.0.0  
> **Ngày Hoàn Thiện:** Tháng 11/2026  
> **Thư Mục Lưu Trữ:** `docs/spec/`

---

## 1. Giới Thiệu Dự Án

**The Dev's Pixel Room** là một portfolio cá nhân cao cấp được xây dựng dưới dạng một căn phòng Isometric 3D mô phỏng không gian làm việc của một Full-stack Developer. 

Khác biệt với các portfolio truyền thống (dạng landing page cuộn dọc phẳng), dự án sử dụng **Three.js** và **React Three Fiber (R3F)** để biến mỗi vật thể trong căn phòng 3D thành một điểm tương tác vật lý trực quan, kích hoạt các phân hệ nội dung, giải trí và tiện ích chuyên sâu.

```
+--------------------------------------------------------------------------+
|                       THE DEV'S PIXEL ROOM ECOSYSTEM                    |
+--------------------------------------------------------------------------+
|  [3D Room Canvas]  <--->  [Interactive Raycasting]  <--->  [Global HUD]  |
|         |                                                       |        |
|         v                                                       v        |
|  +--------------+  +--------------+  +--------------+  +--------------+  |
|  | Portfolio OS |  |  TV Arcade   |  | Lo-Fi Vinyl  |  | Creative Hub |  |
|  |  (PC/Desk)   |  | (Retro Game) |  |   (Music)    |  | (Polaroid/KB)|  |
|  +--------------+  +--------------+  +--------------+  +--------------+  |
|         |                 |                 |                 |          |
|         +-----------------+-----------------+-----------------+          |
|                                   |                                      |
|                                   v                                      |
|            [Data Service Layer: Supabase & LocalStorage]                 |
|                                   |                                      |
|                                   v                                      |
|                  [Admin CMS & Analytics Management]                     |
+--------------------------------------------------------------------------+
```

---

## 2. Bản Đồ Phân Rã Chức Năng (Functional Decomposition Map)

Hệ thống được chuẩn hóa thành **7 phân hệ chức năng độc lập** nhưng liên kết chặt chẽ qua kiến trúc Zustand State Machine và React Component Composition:

| STT | Phân Hệ Chức Năng | File Đặc Tả Chi Tiết | Mô Tả Trọng Tâm |
| :---: | :--- | :--- | :--- |
| **01** | **Phân Hệ 3D Scene, Ánh Sáng & Nhân Vật** | [`01-core-3d-scene.md`](./01-core-3d-scene.md) | Không gian Isometric 3D, OrbitControls, 4 kịch bản ánh sáng (Morning, Sunset, Rainy, Night), Post-processing, Raycasting tương tác và nhân vật Pixel autonomous. |
| **02** | **Phân Hệ Portfolio OS & Quản Lý Nội Dung** | [`02-portfolio-os-panels.md`](./02-portfolio-os-panels.md) | Giao diện hệ điều hành cổ điển Windows 95, quản lý cửa sổ kéo/thả/resize, Projects, Skills Matrix, About Me, Reading Shelf và Contact Form qua EmailJS. |
| **03** | **Phân Hệ TV Retro Arcade & Mini Games** | [`03-tv-arcade-games.md`](./03-tv-arcade-games.md) | Máy chơi game cổ điển tích hợp trên màn hình TV 3D, 4 game (Snake, Pong, Dino Run, Tetris), Gamepad ảo mobile, bảng điểm cao và leaderboard. |
| **04** | **Phân Hệ Âm Thanh & Máy Phát Nhạc Lo-Fi** | [`04-audio-music-player.md`](./04-audio-music-player.md) | Máy đĩa than vinyl 3D tương tác, mini player Spotify lơ lửng, playlist Lo-Fi, điều khiển âm lượng, seek bar và sound effects engine không gian. |
| **05** | **Phân Hệ Tiện Ích Tương Tác & Easter Eggs** | [`05-easter-eggs-utilities.md`](./05-easter-eggs-utilities.md) | Studio Polaroid Lightbox với hiệu ứng 3D Parallax Tilt, Photo Mode chụp canvas WebGL, Kanban Board kéo thả, Sổ lưu bút Guestbook, Chú mèo tương tác và Đồng hồ treo tường. |
| **06** | **Phân Hệ HUD, Điều Hướng & Đa Ngôn Ngữ** | [`06-hud-navigation-i18n.md`](./06-hud-navigation-i18n.md) | Floating HUD Capsule, gợi ý thao tác auto-fade, chuyển đổi thời tiết, hệ thống song ngữ VI/EN (i18next), quy trình Preload tài nguyên và Cinematic Welcome. |
| **07** | **Phân Hệ Admin CMS & Tầng Dữ Liệu Data Service** | [`07-admin-data-service.md`](./07-admin-data-service.md) | Cổng quản trị Admin CMS bảo mật, CRUD Projects, Skills, Guestbook, Playlist; tầng DataService tích hợp đồng bộ Supabase Cloud PostgreSQL với LocalStorage offline. |

---

## 3. Công Nghệ Nền Tảng (Technology Stack)

### Core Frontend & 3D Engine
- **React 18.x:** SPA Component Framework.
- **Three.js (r160+):** Thư viện dựng hình đồ họa 3D WebGL.
- **@react-three/fiber (R3F v8):** Cầu nối Three.js declaratively theo chuẩn React.
- **@react-three/drei:** Bộ tiện ích camera, shaders, textures, html overlays cho R3F.
- **@react-three/postprocessing:** Pipeline xử lý hậu kỳ (N8AO, Bloom, Vignette, ToneMapping).
- **Vite 5.x:** Build tool siêu tốc, HMR và tối ưu hóa phân tách bundle (Code Splitting).

### Quản Lý Trạng Thái & Dữ Liệu
- **Zustand:** Central Store nhẹ, tối ưu hóa zero re-render qua selective state subscriptions.
- **Supabase JS Client:** Backend-as-a-Service cho Database PostgreSQL, Realtime and Auth.
- **LocalStorage API:** Bộ nhớ đệm offline-first lưu trữ thiết lập người dùng, điểm game, task kanban.

### Giao Diện & Tiện Ích
- **Tailwind CSS & Vanilla CSS Modules:** Phối hợp linh hoạt giữa Glassmorphism hiện đại và Pixel Art Retro.
- **Lucide React:** Bộ biểu tượng vector nhất quán.
- **i18next & react-i18next:** Đa ngôn ngữ quốc tế (Việt - Anh).
- **EmailJS:** Dịch vụ gửi form liên hệ trực tiếp không cần server riêng.
- **Vercel Analytics:** Giám sát hành vi người dùng và hiệu năng Web Vitals.

---

## 4. Nguyên Tắc Thiết Kế Kỹ Thuật (Engineering Principles)

1. **Performance-First (60 FPS on Standard Hardware):**
   - Triệt tiêu hoàn toàn Garbage Collection spikes trong Render Loop bằng cơ chế **Flyweight Pattern** (chia sẻ Geometries & Materials).
   - Module Texture Caching ngăn tải lại texture procedurally.
   - Throttling/Debouncing các thao tác resize, raycast pointer events.
2. **Offline-First & Graceful Degradation:**
   - Hoạt động mượt mà ngay cả khi không có kết nối internet nhờ dữ liệu mặc định (`portfolio.js`, `playlist.js`) và bộ nhớ `LocalStorage`.
   - WebGL ErrorBoundary đảm bảo giao diện HTML tĩnh hiển thị nếu thiết bị người dùng không hỗ trợ card đồ họa 3D.
3. **Clean Code & Separation of Concerns (SoC):**
   - Tách biệt rõ ràng giữa **3D Representation Layer** (`src/components/Room/`), **UI Overlay Layer** (`src/components/UI/`), **Business Logic & State Layer** (`src/store/`), và **Data Access Layer** (`src/services/`).

