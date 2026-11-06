# Đặc Tả Kỹ Thuật: Phân Hệ Tiện Ích Tương Tác & Easter Eggs

> **Mã Phân Hệ:** `SPEC-05`  
> **Thành Phần Liên Quan:** `src/components/UI/PolaroidLightbox.jsx`, `src/components/UI/PhotoMode.jsx`, `src/components/UI/KanbanOverlay.jsx`, `src/components/UI/GuestbookOverlay.jsx`, `src/components/Room/Cat.jsx`  
> **Trạng Thái:** Đã hoàn thiện  

---

## 1. Mục Tiêu & Phạm Vi (Objective & Scope)

Để tạo nên chiều sâu cảm xúc và tính gắn kết vượt trội so với các website thông thường, căn phòng được trang bị các tiện ích tương tác độc đáo và các bí mật thú vị (Easter Eggs) khơi gợi trí tò mò của người xem.

### Danh mục tiện ích & Easter eggs:
1. **Polaroid Lightbox Studio:** Trình xem ảnh kỷ niệm chuyên nghiệp với hiệu ứng 3D Parallax Tilt, phóng to, xoay ảnh và câu chuyện chi tiết.
2. **In-Game Photo Mode:** Máy ảnh tức thời chụp lại góc nhìn 3D hiện tại của người dùng thành một tấm ảnh Polaroid độ phân giải cao kèm khung ảnh cổ điển để tải về máy.
3. **Interactive Kanban Board:** Bảng công việc Trello mini trên tường hỗ trợ kéo thả các thẻ ghi chú và ghi nhớ trạng thái công việc.
4. **Sổ Lưu Bút Khách (Guestbook):** Nơi khách ghé thăm dán các mẩu giấy ghi chú nhiều màu sắc để lại lời chúc cho lập trình viên.
5. **Chú Mèo Cam Tương Tác (The Room Cat):** Vật nuôi biết kêu meo meo, đổi biểu cảm và phát hoạt họa khi được nhấp chuột.

---

## 2. Chi Tiết Các Tiện Ích Tương Tác

### 2.1. Polaroid Lightbox Studio (`PolaroidLightbox.jsx`)
- **Kích hoạt:** Khi nhấp vào các khung ảnh nghệ thuật treo tường (`WallDecorations.jsx`) hoặc chọn ảnh trong bộ sưu tập.
- **Tính năng cao cấp:**
  - **3D Parallax Tilt:** Khung ảnh nghiêng theo tọa độ chuột của người dùng tạo cảm giác đang cầm một tấm ảnh vật lý trên tay:
    $$\text{RotateX} = (y - 0.5) \times -15^\circ, \quad \text{RotateY} = (x - 0.5) \times 15^\circ$$
  - **Bộ công cụ Studio (Toolbar):** Zoom (1x, 1.6x, 2.4x), Xoay 90 độ, Xem toàn màn hình (Fullscreen), Tải ảnh gốc, Sao chép link chia sẻ.
  - **Story Drawer:** Ngăn kéo thông tin hiển thị ngày chụp, địa điểm, dòng máy ảnh sử dụng và mẩu chuyện hậu trường song ngữ VI/EN.
  - **Dải phim thu nhỏ (Filmstrip):** Hàng thumbnail ở đáy màn hình giúp chuyển ảnh nhanh chóng.
  - **Phím tắt:** `Mũi tên Trái/Phải` để chuyển ảnh, `+/-` để zoom, `R` để xoay, `I` để mở story, `Esc` để đóng.

---

### 2.2. WebGL In-Game Photo Mode (`PhotoMode.jsx`)
- **Kích hoạt:** Khi nhấp chuột vào chiếc máy ảnh cơ cổ điển đặt trên kệ sách.
- **Quy trình hoạt động:**
  1. Trích xuất buffer điểm ảnh trực tiếp từ WebGL Canvas của Three.js:
     ```javascript
     const canvas = document.querySelector('canvas')
     const dataUrl = canvas.toDataURL('image/png')
     ```
  2. Tạo một canvas 2D độ phân giải cao ($900 \times 1080$ pixel).
  3. Đổ màu nền Polaroid trắng kem cổ điển (`#F8FAFC`).
  4. Vẽ hình ảnh góc phòng 3D vào khung ảnh chính ($800 \times 800$ pixel).
  5. Đóng dấu watermark nghệ thuật ở phần chân ảnh:
     - Dòng chữ: *"The Dev's Pixel Room — Captured at hh:mm • Theme: Morning/Night"*.
     - Chữ ký viết tay số hóa của tác giả.
  6. Cho phép người dùng nhấn nút **Tải Về (Download PNG)** lưu vào máy tính cá nhân.

---

### 2.3. Bảng Kanban Kéo Thả (`KanbanOverlay.jsx`)
- **Kích hoạt:** Khi nhấp chuột vào bảng Plan Board gắn trên tường phòng.
- **Cấu trúc cột:**
  - `TODO` (Cần làm)
  - `IN PROGRESS` (Đang triển khai)
  - `DONE` (Đã hoàn thành)
- **Tương tác:** Cho phép người dùng kéo thả tự do các thẻ ghi chú hài hước của dân lập trình ("Fix 99 bugs", "Coffee intake: 99%", "Learn Rust", "Touch grass") giữa 3 cột.
- **Lưu trữ:** Vị trí các thẻ được lưu tự động vào `localStorage` (`nghia-kanban-tasks`) và có nút "Reset Default" để hoàn tác về ban đầu.

---

### 2.4. Sổ Lưu Bút Khách Ghé Thăm (`GuestbookOverlay.jsx`)
- **Kích hoạt:** Khi nhấp chuột vào cuốn sổ tay đặt trên bàn làm việc.
- **Tính năng:**
  - Khách truy cập có thể nhập tên và nội dung lời nhắn (tối đa 280 ký tự).
  - Chọn 1 trong 5 màu giấy ghi chú pastel: *Vàng nắng, Xanh lam, Hồng phấn, Xanh bạc hà, Tím mộng mơ*.
  - Nhấn Gửi: Lời nhắn được lưu vào cơ sở dữ liệu Supabase (hoặc LocalStorage) và hiển thị tức thì dưới dạng các mẩu giấy dán tường ngẫu nhiên góc nghiêng $\pm 4^\circ$ sống động.

---

### 2.5. Chú Mèo Cam Tương Tác (`Cat.jsx`)
- **Vị trí:** Nằm cuộn tròn thư giãn trên chiếc đệm êm cạnh bàn làm việc.
- **Tương tác:**
  - **Theo dõi con trỏ chuột (Head & Ear Cursor Tracking):** Khi rê chuột vào khu vực mèo, mắt mèo mở to tỉnh giấc, hai tai dựng lên tò mò và đầu mèo tự động xoay nhẹ nhàng theo hướng con trỏ chuột (`state.pointer`). Bong bóng `zzz` ngủ tạm thời ẩn đi.
  - **Nhấp chuột vào mèo:** Mèo mở to mắt ngạc nhiên, rung đuôi, phát ra tiếng kêu "Meow" ngọt ngào và trái tim bay lên trên đầu.
  - **Khi không tương tác:** Sau vài giây chuột rời đi, mèo tự động nhắm mắt ngủ trở lại, đầu quay về vị trí nghỉ và phát ra tiếng thở rừ rừ (purr) kèm các bong bóng `z` bay lên.

---

## 3. Tiêu Chí Nghiệm Thu (Acceptance Criteria)

- [x] **Ảnh xuất chất lượng cao:** File ảnh xuất từ Photo Mode sắc nét, không bị nhòe vỡ font chữ chữ ký.
- [x] **Kéo thả mượt mà:** Thao tác kéo thẻ Kanban trên thiết bị di động có hỗ trợ touch drag trơn tru.
- [x] **Chống Spam Guestbook:** Giới hạn mỗi người dùng chỉ được gửi 1 lời nhắn trong vòng 30 giây để tránh làm tràn ngập cơ sở dữ liệu.

