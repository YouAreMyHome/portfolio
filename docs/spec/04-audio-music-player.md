# Đặc Tả Kỹ Thuật: Phân Hệ Âm Thanh & Máy Phát Nhạc Lo-Fi

> **Mã Phân Hệ:** `SPEC-04`  
> **Thành Phần Liên Quan:** `src/components/Room/RecordPlayer.jsx`, `src/components/UI/MusicPlayer.jsx`, `src/data/playlist.js`, `src/utils/useSounds.js`  
> **Trạng Thái:** Đã hoàn thiện  

---

## 1. Mục Tiêu & Phạm Vi (Objective & Scope)

Âm nhạc và hiệu ứng âm thanh là yếu tố then chốt tạo nên bầu không khí thư thái (chill vibe) của căn phòng lập trình viên. 

Phân hệ **Âm Thanh & Máy Phát Nhạc Lo-Fi** cung cấp:
- **Tương tác 3D với Máy đĩa than (Record Player):** Mô hình đầu đĩa than cơ học chi tiết với cần đọc (Tonearm), đĩa than xoay (Spinning Vinyl) và hiệu ứng nốt nhạc bay lơ lửng.
- **Trình phát nhạc lơ lửng (Floating Lo-Fi Player):** Giao diện phát nhạc phong cách Spotify mini, hỗ trợ danh sách bài hát (Playlist), thanh tiến trình (Seek bar), chế độ lặp, điều chỉnh âm lượng.
- **Sound Effects Engine:** Hệ thống âm thanh phản hồi thao tác người dùng (UI clicks, hover ticks, meow, camera shutter, success chimes).

---

## 2. Kiến Trúc Phân Hệ Âm Thanh (Audio Architecture)

```
Sound Architecture
 ├── Sound Effects Engine (src/utils/useSounds.js & useSoundStore)
 │    ├── Web Audio API / Audio Elements Cache
 │    ├── Global Mute Controller (Đồng bộ với nút âm thanh trên HUD)
 │    ├── Sound Effects Registry:
 │    │    ├── 'click': Âm thanh lách cách cơ học khi nhấn nút
 │    │    ├── 'hover': Tiếng tick siêu nhỏ khi lướt qua vật thể 3D
 │    │    ├── 'success': Hợp âm chuông ngân khi hoàn tất gửi mail / tải ảnh
 │    │    ├── 'meow': Tiếng mèo kêu meo meo khi bấm vào mèo
 │    │    ├── 'camera': Tiếng chớp màn trập cơ học khi chụp ảnh
 │    │    └── 'gameBeep' / 'gameOver': Âm thanh điện tử 8-bit
 │    └── Volume Controller (Mặc định 0.7)
 │
 └── Lo-Fi Music Subsystem (src/components/UI/MusicPlayer.jsx)
      ├── HTML5 Audio Element (`<audio ref={audioRef} />`)
      ├── Playlist Manager (`src/data/playlist.js` & Supabase sync)
      │    ├── Track Title & Artist Info
      │    ├── Stream Audio URL (Cloudinary / CDN hosted MP3)
      │    └── Album Art Thumbnail
      ├── Playback State Synchronization:
      │    └── isPlaying <---> isRecordPlaying (Zustand Store)
      └── 3D Turntable Sync (`RecordPlayer.jsx`):
           ├── Tonearm Angle: Xoay vào đĩa khi Play, nhấc ra ngoài khi Stop
           └── Vinyl Rotation: Quay liên tục quanh trục Y với vận tốc 33.3 RPM
```

---

## 3. Danh Sách Bài Hát Mặc Định (Lo-Fi Playlist)

Danh sách các bản nhạc Lo-Fi bản quyền miễn phí được tuyển chọn cho môi trường tập trung làm việc:

| STT | Tên Bản Nhạc | Nghệ Sĩ | Thể Loại | Thời Lượng |
| :---: | :--- | :--- | :--- | :---: |
| **01** | *Midnight Coding Session* | Lofi Chill Beats | Lofi Hip-Hop | 02:45 |
| **02** | *Coffee & Code* | Ambient Dreams | Chillhop | 03:12 |
| **03** | *Rainy Windowpane* | Pixel Wanderer | Ambient Relax | 02:58 |
| **04** | *Late Night Debugging* | Synthwave Breeze | Downtempo | 03:30 |
| **05** | *Tokyo Dusk Drift* | Neon Station | Chillwave | 03:05 |

*(Hệ thống hỗ trợ quản trị viên thêm, sửa, xóa bài hát trực tiếp thông qua Admin CMS Portal).*

---

## 4. Đặc Tả Giao Diện Trình Phát Nhạc (`MusicPlayer.jsx`)

Trình phát nhạc hiển thị dưới dạng widget kính mờ (Glassmorphism) hiện đại, có 2 chế độ hiển thị:

### 4.1. Chế độ Mở Rộng (Expanded Player)
- **Thông tin bài hát:** Ảnh bìa album xoay tròn (Vinyl style), tên bài hát, nghệ sĩ biểu diễn.
- **Thanh tiến trình thời gian:** Hiển thị thời gian đã phát `mm:ss` / tổng thời lượng `mm:ss`. Cho phép nhấp chuột để tua đến vị trí bất kỳ (Seek).
- **Bộ điều khiển phát:**
  - Nút Bài Trước (Previous Track).
  - Nút Play / Pause nổi bật với hiệu ứng phát sáng neon tím/hồng.
  - Nút Bài Kế Tiếp (Next Track - tự động chuyển bài khi hết nhạc).
  - Nút Bật/Tắt Lặp lại danh sách (Loop).
- **Điều khiển âm lượng:** Thanh trượt âm lượng trơn tru từ 0% đến 100%.
- **Nút Thu Nhỏ (Minimize):** Giúp người dùng ẩn trình phát nhạc xuống góc mà vẫn nghe nhạc nền.

### 4.2. Chế độ Thu Nhỏ (Mini Floating Pill)
- Thu nhỏ thành một thanh capsule tinh xảo hiển thị sóng nhạc chuyển động (Audio visualizer equalizer animation) và nút Play/Pause.

---

## 5. Tương Tác 3D với Đầu Đĩa Than (`RecordPlayer.jsx`)

1. **Hiệu ứng Cần Đọc (Tonearm Animation):**
   - Khi bài hát bắt đầu (`isRecordPlaying === true`), cần đọc di chuyển mượt mà từ giá đỡ vào rãnh đĩa than.
   - Khi tạm dừng (`isRecordPlaying === false`), cần đọc tự động nâng lên và quay trở lại vị trí nghỉ ban đầu.
2. **Hiệu ứng Đĩa Quay (Spinning Turntable):**
   - Đĩa than quay với tốc độ góc không đổi:
     $$\theta_{y} = \theta_{y} + \omega \cdot \Delta t$$
   - Khi dừng, đĩa giảm tốc độ từ từ (Inertia deceleration) thay vì dừng khựng đột ngột.
3. **Nốt Nhạc Bay (Floating Music Notes):**
   - Các hạt nốt nhạc 3D màu pastel nhẹ nhàng bay lên từ bề mặt đĩa than và tan biến dần vào không khí.

---

## 6. Tiêu Chí Nghiệm Thu (Acceptance Criteria)

- [x] **Tự động chuyển bài mượt mà:** Sự kiện `onEnded` của thẻ `<audio>` tự động kích hoạt bài hát kế tiếp mà không làm gián đoạn trải nghiệm người nghe.
- [x] **Trạng thái Mute toàn cục:** Nhấn nút loa trên HUD góc trên màn hình lập tức tắt tiếng cả nhạc nền và âm thanh tương tác.
- [x] **Xử lý Autoplay Policy:** Trình duyệt hiện đại chặn tự phát âm thanh trước khi có tương tác đầu tiên; hệ thống đảm bảo chỉ phát nhạc khi người dùng chủ động click nút Play hoặc tương tác vào máy đĩa than.

