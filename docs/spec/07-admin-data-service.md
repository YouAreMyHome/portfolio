# Đặc Tả Kỹ Thuật: Phân Hệ Admin CMS & Tầng Dữ Liệu Data Service

> **Mã Phân Hệ:** `SPEC-07`  
> **Thành Phần Liên Quan:** `src/components/Admin/*`, `src/services/dataService.js`, `src/services/supabaseClient.js`, `src/data/schema.sql`  
> **Trạng Thái:** Đã hoàn thiện  

---

## 1. Mục Tiêu & Phạm Vi (Objective & Scope)

Để giúp chủ sở hữu portfolio dễ dàng cập nhật các dự án mới, kỹ năng, bài hát hoặc kiểm duyệt sổ lưu bút mà không cần phải can thiệp sửa mã nguồn hay deploy lại toàn bộ trang web, hệ thống được trang bị một phân hệ **Admin CMS Portal** độc lập kết hợp với tầng dịch vụ dữ liệu **DataService**.

### Phạm vi chức năng:
- **Cổng Quản Trị Admin CMS:** Giao diện quản trị phong cách Dashboard tối giản, bảo mật bằng mã PIN hoặc tài khoản Supabase Auth.
- **Quản lý Dự Án (Projects CRUD):** Thêm dự án mới, chỉnh sửa mô tả song ngữ, đổi ảnh bìa, sắp xếp thứ tự hiển thị.
- **Quản lý Kỹ Năng (Skills CRUD):** Cập nhật danh mục kỹ năng, tỷ lệ thành thạo, thêm các công nghệ mới.
- **Quản lý Nhạc Lo-Fi (Playlist CRUD):** Thêm link stream nhạc mới, sửa tên nghệ sĩ, đổi ảnh bìa đĩa than.
- **Kiểm duyệt Sổ Lưu Bút (Guestbook Moderation):** Duyệt các lời nhắn của khách, xóa các bình luận tiêu cực hoặc spam.
- **Tầng Dữ Liệu Lai (Hybrid Data Architecture):** Tự động đồng bộ với cơ sở dữ liệu đám mây **Supabase Cloud PostgreSQL**, đồng thời cung cấp chế độ dự phòng ngoại tuyến hoàn chỉnh bằng **LocalStorage**.

---

## 2. Kiến Trúc Tầng Dữ Liệu (Data Layer Architecture)

```
                            +---------------------------------------+
                            |     ỨNG DỤNG CLIENT (UI / 3D ROOM)    |
                            +---------------------------------------+
                                                |
                                                v
                            +---------------------------------------+
                            |       UNIFIED DATA SERVICE LAYER      |
                            |       (src/services/dataService.js)   |
                            +---------------------------------------+
                                       /                 \
            [Supabase Configured & Online]             [Offline / Fallback]
                                     /                     \
                                    v                       v
                    +-----------------------+       +-----------------------+
                    |  SUPABASE POSTGRESQL  |       |     LOCALSTORAGE      |
                    |  (Cloud Database)     |       |   (Browser Storage)   |
                    +-----------------------+       +-----------------------+
                                                            |
                                                   (Initial Static Defaults)
                                                            v
                                                    src/data/portfolio.js
                                                    src/data/playlist.js
```

---

## 3. Cấu Trúc Cơ Sở Dữ Liệu (Database Schema Specification)

Được định nghĩa chi tiết trong `src/data/schema.sql`:

### 3.1. Bảng `projects` (Danh Sách Dự Án)
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  description_en TEXT,
  full_description TEXT,
  full_description_en TEXT,
  image TEXT,
  tags TEXT[],
  features TEXT[],
  features_en TEXT[],
  role TEXT,
  team TEXT,
  duration TEXT,
  github TEXT,
  demo TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3.2. Bảng `skills` (Ma Trận Kỹ Năng)
```sql
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- 'frontend' | 'backend' | 'devops' | 'tools'
  name TEXT NOT NULL,
  level INT DEFAULT 80,   -- 1 đến 100
  icon TEXT,
  tags TEXT[],
  sort_order INT DEFAULT 0
);
```

### 3.3. Bảng `playlist` (Danh Sách Nhạc Lo-Fi)
```sql
CREATE TABLE playlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  url TEXT NOT NULL,
  cover TEXT,
  duration INT,           -- Tính theo giây
  sort_order INT DEFAULT 0
);
```

### 3.4. Bảng `guestbook` (Sổ Lưu Bút)
```sql
CREATE TABLE guestbook (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  message TEXT NOT NULL,
  color TEXT DEFAULT '#fef08a',
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3.5. Bảng `game_scores` (Kỷ Lục Điểm Game)
```sql
CREATE TABLE game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id TEXT NOT NULL,  -- 'snake' | 'pong' | 'dino' | 'tetris'
  player_name TEXT NOT NULL,
  score INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 4. Các Chức Năng Cổng Quản Trị (`src/components/Admin/`)

1. **Đăng nhập Quản Trị (`AdminLogin.jsx`):**
   - Xác thực người dùng qua Supabase Email/Password Auth hoặc Master PIN Code cấu hình sẵn trong biến môi trường.
   - Quản lý phiên làm việc bằng Token bảo mật trong session.
2. **Bảng Điều Khiển Dự Án (`AdminProjects.jsx`):**
   - Bảng danh sách dự án với ảnh thumbnail xem trước.
   - Form modal chỉnh sửa trực quan với các trường input song ngữ VI/EN.
   - Nút bật/tắt huy hiệu "Featured Project".
3. **Quản Lý Nhạc Đĩa Than (`AdminPlaylist.jsx`):**
   - Hỗ trợ thêm bản nhạc mới qua URL trực tiếp (mp3 hosted trên Cloudinary hoặc máy chủ bên thứ ba).
   - Nghe thử trực tiếp bài hát trước khi lưu vào danh sách chính thức.
4. **Kiểm Duyệt Lưu Bút (`AdminGuestbook.jsx`):**
   - Xem toàn bộ danh sách lời nhắn từ khách truy cập kèm mốc thời gian và địa chỉ IP ẩn danh.
   - Thao tác 1-click để xóa bỏ các lời nhắn vi phạm chuẩn mực.

---

## 5. Tiêu Chí Nghiệm Thu (Acceptance Criteria)

- [x] **Dự phòng thông minh (Fallback Guarantee):** Nếu mất kết nối internet hoặc chưa thiết lập khóa Supabase API trong file `.env`, hệ thống tự động đọc và ghi vào `localStorage` mà không làm xuất hiện lỗi màn hình đỏ.
- [x] **Bảo Mật Cơ Sở Dữ Liệu (Row Level Security - RLS):**
  - Khách vãng lai (`anon`) chỉ có quyền `SELECT` trên bảng `projects`, `skills`, `playlist` và quyền `INSERT` trên bảng `guestbook`, `game_scores`.
  - Toàn bộ thao tác `UPDATE` và `DELETE` yêu cầu quyền `authenticated` của Admin.

