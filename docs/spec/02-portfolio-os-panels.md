# Đặc Tả Kỹ Thuật: Phân Hệ Portfolio OS & Quản Lý Nội Dung

> **Mã Phân Hệ:** `SPEC-02`  
> **Thành Phần Liên Quan:** `src/components/PortfolioOS/*`, `src/components/UI/PanelOverlay.jsx`, `src/data/portfolio.js`, `src/data/books.js`  
> **Trạng Thái:** Đã hoàn thiện  

---

## 1. Mục Tiêu & Phạm Vi (Objective & Scope)

Phân hệ **Portfolio OS & Panels** là nơi truyền tải toàn bộ năng lực chuyên môn, kinh nghiệm thực chiến và các sản phẩm của kỹ sư phần mềm đến nhà tuyển dụng và đối tác.

Thay vì hiển thị dạng form mẫu nhàm chán, hệ thống mang đến trải nghiệm độc đáo:
- **Chế độ Retro OS (Windows 95 / Portfolio OS):** Một môi trường desktop giả lập chân thực với thanh Taskbar, Start Menu, Icon kéo thả, và cửa sổ ứng dụng đa nhiệm (Window Manager).
- **Chế độ Panels Trực Quan:** Các modal trình bày chi tiết về Dự Án (Projects), Kỹ Năng (Skills Matrix), Giới Thiệu (About Me), Tủ Sách Công Nghệ (Books) và Biểu Mẫu Liên Hệ (Contact Form).

---

## 2. Kiến Trúc Portfolio OS (Windows 95 Simulation)

```
PortfolioOS Container (Desktop Teal #008080)
 ├── Desktop Icons Grid
 │    ├── [▣] My Computer      -> Mở Trình quản lý Kỹ Năng (Skills Explorer)
 │    ├── [□] My Projects      -> Mở Trình quản lý Dự Án (Projects Explorer)
 │    ├── [■] Terminal         -> Mở Cửa sổ Dòng Lệnh Tương Tác (CLI Emulator)
 │    ├── [≡] About Me.txt     -> Mở Notepad Giới Thiệu Bản Thân
 │    ├── [✕] Recycle Bin      -> Thùng rác tương tác vui nhộn
 │    └── [✉] Contact Me.exe   -> Mở Biểu Mẫu Gửi Email
 ├── Window Manager (Multi-Window Subsystem)
 │    ├── Z-Index Controller (Quản lý cửa sổ active / focused lên trên cùng)
 │    ├── Window Dragging Engine (Kéo thả tiêu đề cửa sổ)
 │    ├── Window Resizing Engine (Co giãn kích thước từ các cạnh)
 │    ├── Window Controls: Minimize, Maximize / Restore, Close
 │    └── Window Content Views
 └── Windows Taskbar (Silver #C0C0C0)
      ├── Start Menu Button (Logo Windows 95 cổ điển)
      ├── Active Tasks Pills (Chuyển đổi nhanh giữa các ứng dụng đang mở)
      └── System Tray (Đồng hồ số 12h/24h và icon âm lượng)
```

---

## 3. Danh Mục Các Phân Hệ Nội Dung (Content Panels)

### 3.1. Dự Án Tiêu Biểu (`ProjectsPanel`)
- **Nguồn dữ liệu:** Đồng bộ qua `dataService.getProjects()` (lấy từ Supabase hoặc fallback từ `src/data/portfolio.js`).
- **Cấu trúc dữ liệu dự án:**
  - `id`: Mã định danh duy nhất.
  - `title`: Tên dự án.
  - `description` / `descriptionEn`: Tóm tắt dự án song ngữ.
  - `fullDescription` / `fullDescriptionEn`: Mô tả chi tiết kỹ thuật.
  - `image`: URL ảnh mockup / thumbnail chất lượng cao.
  - `tags`: Danh sách công nghệ sử dụng (`React`, `Node.js`, `Three.js`, `Tailwind`, `PostgreSQL`, v.v.).
  - `features`: Các tính năng cốt lõi đã hiện thực.
  - `role`: Vai trò trong dự án (Tech Lead, Full-stack, Frontend).
  - `team`: Quy mô đội ngũ.
  - `duration`: Thời gian triển khai.
  - `github`: Đường dẫn mã nguồn GitHub công khai.
  - `demo`: Đường dẫn trải nghiệm trực tiếp (Live Demo URL).
  - `featured`: Đánh dấu dự án nổi bật (`true`/`false`).

### 3.2. Ma Trận Kỹ Năng (`SkillsPanel`)
Phân nhóm trực quan theo 4 chuyên môn chính:
1. **Frontend Development:** React, TypeScript, Next.js, Three.js, Redux/Zustand, Tailwind CSS.
2. **Backend & Architecture:** Node.js, Express, NestJS, RESTful API, GraphQL, Microservices.
3. **Databases & DevOps:** PostgreSQL, MongoDB, Redis, Docker, CI/CD Actions, Vercel, AWS.
4. **Tools & Best Practices:** Git, Agile/Scrum, Vite, Webpack, Jest, Vitest, Figma.
- Mỗi kỹ năng bao gồm mức độ thành thạo (Progress bar), số năm kinh nghiệm và các tag liên quan.

### 3.3. Giới Thiệu & Học Vấn (`AboutPanel`)
- Tiểu sử tác giả, triết lý lập trình, định hướng nghề nghiệp.
- **Lộ trình học vấn (Education):** Bằng cấp, chuyên ngành kỹ thuật phần mềm, các chứng chỉ quốc tế.
- **Dấu mốc kinh nghiệm (Experience Timeline):** Quá trình làm việc tại các công ty/dự án trước đây theo thứ tự thời gian đảo ngược.

### 3.4. Kệ Sách Lập Trình (`BooksPanel`)
- Trình bày những cuốn sách kỹ thuật nền tảng yêu thích (ví dụ: *Clean Code*, *Designing Data-Intensive Applications*, *The Pragmatic Programmer*).
- Thẻ sách 3D có bìa, tác giả, tóm tắt bài học tâm đắc và điểm số đánh giá.

### 3.5. Biểu Mẫu Liên Hệ (`ContactPanel` & Email Delivery)
- Cho phép khách ghé thăm hoặc nhà tuyển dụng gửi tin nhắn trực tiếp đến tác giả.
- **Tích hợp EmailJS:**
  - Tự động kiểm tra tính hợp lệ dữ liệu (Email regex, họ tên, nội dung tối thiểu 10 ký tự).
  - Gửi request đến EmailJS API (`VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_USER_ID`).
  - Hiển thị trạng thái gửi mượt mà (Loading spinner, Success checkmark, Error notification).
- **Kênh liên kết xã hội:** Email, GitHub, LinkedIn, Số điện thoại và Địa điểm.

---

## 4. Trình Giả Lập Dòng Lệnh (Terminal CLI Emulator)

Ứng dụng Terminal bên trong Portfolio OS cho phép lập trình viên tương tác qua các câu lệnh Unix quen thuộc:

| Lệnh (Command) | Chức Năng |
| :--- | :--- |
| `help` | Liệt kê toàn bộ các câu lệnh được hỗ trợ |
| `about` | In thông tin ngắn gọn về tác giả |
| `skills` | Hiển thị ma trận kỹ năng dạng cây thư mục ASCII |
| `projects` | Liệt kê các dự án kèm link repo |
| `contact` | Hiển thị thông tin email và mạng xã hội |
| `clear` | Xóa sạch màn hình terminal |
| `sudo` | Phản hồi easter egg hài hước ("Permission denied: You are a guest!") |
| `matrix` | Kích hoạt hiệu ứng mưa ký tự xanh lá phong cách The Matrix |

---

## 5. Tiêu Chí Nghiệm Thu (Acceptance Criteria)

- [x] **Cửa sổ mượt mà:** Thao tác kéo thả (drag) và co giãn (resize) cửa sổ không bị khựng (stutter) trên màn hình 144Hz.
- [x] **Quản lý Z-Index chính xác:** Nhấp vào bất kỳ phần nào của một cửa sổ đang bị che sẽ lập tức đưa cửa sổ đó lên lớp trên cùng.
- [x] **Gửi Email an toàn:** Form liên hệ có cơ chế chống spam (rate limiting nút submit trong 5 giây sau khi gửi).
- [x] **Responsive hoàn hảo:** Trên thiết bị di động, Portfolio OS tự động chuyển sang giao diện Full-screen Card Panel hiện đại, dễ thao tác chạm.

