# Đặc Tả Kỹ Thuật: Phân Hệ TV Retro Arcade & Mini Games

> **Mã Phân Hệ:** `SPEC-03`  
> **Thành Phần Liên Quan:** `src/components/Room/TVScreen.jsx`, `src/components/Room/games/*`, `src/components/UI/TVGameOverlay.jsx`, `src/components/UI/LeaderboardOverlay.jsx`  
> **Trạng Thái:** Đã hoàn thiện  

---

## 1. Mục Tiêu & Phạm Vi (Objective & Scope)

Phân hệ **TV Retro Arcade** là điểm nhấn giải trí sáng tạo, chứng minh khả năng làm chủ đồ họa Canvas 2D kết hợp với kết cấu Three.js 3D Mesh. 

Thay vì chỉ mở một popup game đơn thuần, trò chơi được kết xuất trực tiếp lên **bề mặt màn hình chiếc TV 3D** đặt trong phòng thông qua công nghệ `THREE.CanvasTexture`, đồng thời camera tự động hạ thấp và phóng to ngang tầm mắt người chơi.

### Danh mục trò chơi tích hợp:
1. **Snake (Rắn Săn Mồi Cổ Điển):** Phong cách Nokia 3310 hiện đại hóa với bảng màu Neon.
2. **Pong (Bóng Bàn Điện Tử):** Trò chơi đối kháng 1 người chơi với AI thuật toán bám bóng.
3. **Dino Run (Khủng Long Vượt Chướng Ngại Vật):** Nhảy né xương rồng và chim bay, tăng tốc theo thời gian.
4. **Tetris (Xếp Hình Cổ Điển):** 7 khối tetromino chuẩn, xoay khối, làm sạch hàng, tính điểm combo.

---

## 2. Kiến Trúc Kỹ Thuật (Engine Architecture)

```
Three.js TV Mesh Model (src/components/Room/TVSetup.jsx)
 │
 └── TVScreen Material (THREE.MeshBasicMaterial)
      └── map: CanvasTexture (được tạo từ Offscreen HTML Canvas 512x384)
           │
           └── Game Loop (RequestAnimationFrame / R3F useFrame)
                ├── Game State Manager (Select Menu | Playing | Paused | Game Over)
                ├── Game Engine Registry (gameRegistry.js)
                │    ├── SnakeGame.js (Update & Render)
                │    ├── PongGame.js (Update & Render)
                │    ├── DinoGame.js (Update & Render)
                │    └── TetrisGame.js (Update & Render)
                └── Controller Input Bus
                     ├── Keyboard Listener (Arrow Keys, WASD, Space, Enter, Escape)
                     └── TVGameOverlay (Virtual Mobile D-Pad & Action Buttons)
```

---

## 3. Đặc Tả Chi Tiết Từng Trò Chơi

### 3.1. Snake Game (`SnakeGame.js`)
- **Quy tắc:** Điều khiển chú rắn di chuyển trên lưới ô vuông $20 \times 15$. Mỗi lần ăn mồi, chiều dài tăng thêm 1 đoạn, điểm số cộng thêm và tốc độ di chuyển tăng nhẹ.
- **Va chạm:** Thua khi đầu rắn cắn vào đuôi hoặc đâm vào 4 bức tường xung quanh.
- **Hiệu ứng:** Mồi phát sáng nhấp nháy, hiệu ứng nổ hạt pixel nhỏ khi ăn mồi.

### 3.2. Pong Game (`PongGame.js`)
- **Quy tắc:** Người chơi điều khiển thanh trượt bên trái, máy tính (AI) điều khiển thanh trượt bên phải. Quả bóng nảy qua lại giữa 2 thanh trượt và 2 mép trên/dưới.
- **Vật lý quả bóng:** Góc nảy phụ thuộc vào điểm tiếp xúc trên thanh trượt (tiếp xúc rìa tạo góc lệch lớn).
- **Trí tuệ nhân tạo (AI):** AI có tốc độ di chuyển giới hạn và độ trễ ngẫu nhiên (humanized delay) để người chơi có khả năng chiến thắng.
- **Tính điểm:** Ai đạt 5 điểm trước sẽ chiến thắng ván đấu.

### 3.3. Dino Run (`DinoGame.js`)
- **Quy tắc:** Chú khủng long tự động chạy sang phải trên nền sa mạc cuộn liên tục (Parallax scrolling). Người chơi nhấn phím Nhảy (Space / Mũi tên Lên) để vượt qua các bụi xương rồng và bầy chim bay ở các độ cao khác nhau.
- **Trọng lực & Nhảy:** Áp dụng công thức gia tốc trọng lực tự nhiên:
  $$v_y = v_y + g \cdot \Delta t, \quad y = y + v_y \cdot \Delta t$$
- **Chu kỳ Ngày / Đêm:** Cứ sau mỗi 500 điểm, màu nền chuyển đổi nhịp nhàng giữa ngày và đêm.

### 3.4. Tetris Game (`TetrisGame.js`)
- **Quy tắc:** Bảng chơi kích thước $10 \times 20$ ô. Các khối tetromino (I, J, L, O, S, T, Z) rơi từ trên xuống.
- **Hệ thống điều khiển:** Di chuyển trái/phải, xoay 90 độ theo chiều kim đồng hồ, thả rơi nhanh (Soft drop), và thả rơi tức thì (Hard drop).
- **Làm sạch hàng (Line Clear):** Cứ mỗi hàng ngang được lấp đầy, hàng đó sẽ nhấp nháy trắng và biến mất, các khối phía trên rơi xuống. Điểm số tăng theo cấp số nhân nếu ăn 2, 3 hoặc 4 hàng cùng lúc (Tetris combo).

---

## 4. Hệ Thống Điều Khiển & Giao Diện Cảm Ứng (Virtual Gamepad)

Khi chế độ chơi game được bật trên thiết bị di động hoặc máy tính bảng (`TVGameOverlay.jsx`):
1. **Bàn phím ảo D-Pad (Bên trái):**
   - 4 phím hướng: Lên, Xuống, Trái, Phải.
   - Hỗ trợ sự kiện chạm giữ liên tục (`PointerDown` $\rightarrow$ `PointerUp` / `PointerLeave`), giúp rắn hoặc thanh trượt di chuyển mượt mà không bị khựng.
2. **Nút Hành Động (Bên phải):**
   - Nút **`A`** (Xoay khối Tetris / Nhảy Dino).
   - Nút **`B`** (Thả nhanh).
   - Nút **`START / PAUSE`** (Tạm dừng hoặc bắt đầu ván đấu).
   - Nút **`EXIT`** (Thoát game, camera tự động trở về góc phòng).

---

## 5. Lưu Trữ Điểm Cao & Bảng Xếp Hạng (High Scores & Leaderboard)

- **Lưu cục bộ:** Điểm cao nhất của từng game được tự động lưu vào `localStorage` qua key `portfolio_local_scores`.
- **Đồng bộ đám mây (Cloud Leaderboard):**
  - Khi người chơi đạt kỷ lục cá nhân mới, hệ thống mở modal `LeaderboardOverlay.jsx` cho phép nhập tên (Nickname).
  - Điểm số được gửi lên bảng `game_scores` trên **Supabase Database** để xếp hạng toàn cầu giữa tất cả các vị khách ghé thăm portfolio.

---

## 6. Tiêu Chí Nghiệm Thu (Acceptance Criteria)

- [x] **Texture cập nhật tức thì:** `CanvasTexture.needsUpdate = true` chạy theo từng frame game mà không gây drop FPS của Three.js canvas chính.
- [x] **Trải nghiệm âm thanh 8-bit:** Phát tiếng "beep" khi ăn điểm, tiếng nổ "boom" khi thua cuộc (có thể tắt/bật qua nút loa HUD).
- [x] **Phản hồi cảm ứng nhạy:** D-Pad ảo trên điện thoại không bị delay thao tác chạm kép (disabled default browser pinch-to-zoom).

