# Đặc Tả Kỹ Thuật: Phân Hệ 3D Scene, Ánh Sáng & Nhân Vật

> **Mã Phân Hệ:** `SPEC-01`  
> **Thành Phần Liên Quan:** `src/components/Room/*`, `src/store/useStore.js`, `src/App.jsx`  
> **Trạng Thái:** Đã hoàn thiện & Tối ưu hóa  

---

## 1. Mục Tiêu & Phạm Vi (Objective & Scope)

Phân hệ **3D Scene** đóng vai trò là "sân khấu trung tâm" của toàn bộ ứng dụng, tái hiện căn phòng Isometric 3D với phong cách Pixel/Voxel thẩm mỹ cao. 

### Phạm vi chức năng:
- Kết xuất không gian phòng 3D với góc nhìn trực diện Isometric bằng **Orthographic Camera**.
- Cung cấp cơ chế điều khiển tự do bị giới hạn (`OrbitControls` có chặn góc xoay và zoom) để giữ vững góc nhìn đẹp nhất của căn phòng.
- Tạo lập bầu không khí thời gian trong ngày với 4 kịch bản ánh sáng: **Morning (Sáng)**, **Sunset (Hoàng hôn)**, **Rainy (Mưa rào)**, và **Night (Đêm ấm áp)**.
- Xử lý Raycasting chuột để người dùng tương tác mở các tính năng khi click hoặc hover lên các vật thể trong phòng.
- Mô phỏng nhân vật Pixel (The Dev) có khả năng tự động thực hiện các sinh hoạt trong phòng (uống cà phê, vuốt ve mèo, gõ code, vươn vai, đi ngủ).

---

## 2. Kiến Trúc Thành Phần (Component Architecture)

```
Scene (src/App.jsx)
 ├── Canvas (frameloop={isTabHidden ? 'never' : 'always'}, Orthographic, shadows="soft", gl={powerPreference: "high-performance"})
 │    ├── Dynamic Scene Color Background
 │    ├── SceneLighting (DirectionalLight, AmbientLight, HemisphereLight, RectAreaLight)
 │    ├── VolumetricAtmosphere (Hiệu ứng hạt bụi, ánh sáng lọt khe)
 │    ├── CameraController (Điều hướng hoạt ảnh camera giữa Isometric và TV View)
 │    ├── OrbitControls (Giới hạn Azimuth -45°..45°, Polar 30°..72°, Zoom 40..150)
 │    ├── Room (Root Container)
 │    │    ├── Floor & FloorDetails (Sàn gỗ ghép, thảm dệt, gạch lát)
 │    │    ├── Walls (Tường chính, phào chân tường, ổ cắm điện)
 │    │    ├── Window (Cửa sổ chuyển kịch bản ngoài trời, rèm che)
 │    │    ├── DeskSetup (Bàn làm việc, ghế công thái học, PC dual monitor)
 │    │    ├── Bed (Giường ngủ ấm áp, chăn gối mềm mại)
 │    │    ├── TVSetup & TVScreen (Kệ TV retro và màn hình TV game)
 │    │    ├── RecordPlayer (Máy phát đĩa than bàn xoay)
 │    │    ├── PlanBoard & WallDecorations (Bảng Kanban, tranh Canvas nghệ thuật)
 │    │    ├── Cat (Chú mèo cam tương tác)
 │    │    └── PixelPerson (Nhân vật đại diện lập trình viên)
 │    └── PostProcessingEffects (N8AO Ambient Occlusion, Bloom, ToneMapping, Vignette, TiltShift Diorama)
```

---

## 3. Hệ Thống Ánh Sáng & Kịch Bản Môi Trường (Lighting & Atmosphere)

Hệ thống ánh sáng thay đổi động dựa trên `lightingPreset` từ Zustand store:

| Kịch Bản (`id`) | Màu Nền Scene | Nguồn Sáng Chính (Key Light) | Nguồn Sáng Phụ (Fill Light) | Hiệu Ứng Bầu Không Khí |
| :--- | :--- | :--- | :--- | :--- |
| **`morning`** | `#EFEBE4` | Ánh nắng vàng sáng `#FFF8E7`, intensity 2.2, castShadow | Ánh trời xanh dịu `#E0F2FE`, intensity 0.8 | Hạt bụi lơ lửng ấm áp |
| **`sunset`** | `#2A130C` | Ánh hoàng hôn cam đỏ `#FF7A45`, intensity 2.5 | Ánh tím thẫm `#581C87`, intensity 0.6 | Ánh chiều tà đổ bóng dài |
| **`rainy`** | `#1E2530` | Ánh xám xanh lạnh `#94A3B8`, intensity 1.2 | Ánh xanh đen `#0F172A`, intensity 0.5 | Mưa rơi bên ngoài cửa sổ |
| **`night`** | `#0B0F19` | Đèn ngủ ấm `#FEF08A`, intensity 1.8 | Đèn neon trăng `#38BDF8`, intensity 0.4 | Đèn dây phát sáng, đom đóm |

### Cơ chế Tối ưu Cửa Sổ (Window Scenery Caching):
- Texture cảnh quan bên ngoài cửa sổ (mặt trời mọc, bầu trời đêm, mây mưa) được tạo bằng HTML Canvas procedural và **lưu vào Module Cache** (`SCENERY_TEXTURE_CACHE`), loại bỏ hoàn toàn việc tạo lại Canvas/Texture gây rò rỉ bộ nhớ VRAM.

---

## 4. Cơ Chế Tương Tác Vật Thể (Interactive Raycasting)

Thành phần `InteractiveObject.jsx` đóng vai trò là wrapper cho bất kỳ đối tượng 3D nào có thể tương tác:

```jsx
<InteractiveObject 
  name="pc" 
  panelId="projects" 
  hoverLift={0.06}
  onClick={handleCustomAction}
>
  <DeskSetup />
</InteractiveObject>
```

### Nguyên lý hoạt động:
1. **Pointer Over (`onPointerOver`):**
   - Kích hoạt âm thanh hover nhẹ nhàng (`playHover()`).
   - Cập nhật `hoveredObject` trong store $\rightarrow$ Hiển thị tooltip gợi ý ở HUD dưới chân màn hình.
   - Nâng vật thể lên trục Y (`hoverLift: 0.05..0.08`) qua `useFrame` với chuyển động mượt mà (lerp).
   - Đổi con trỏ chuột sang `cursor: pointer`.
2. **Pointer Out (`onPointerOut`):**
   - Trả vật thể về vị trí gốc Y=0.
   - Xóa `hoveredObject` khỏi store $\rightarrow$ Tooltip mờ dần.
3. **Click Event (`onClick`):**
   - Phát âm thanh phản hồi click (`playClick()`).
   - Nếu có `panelId`, tự động gọi `openPanel(panelId)`.
   - Nếu có `onClick` tùy chỉnh, thực thi hàm callback (ví dụ: mở Photo Mode, bật máy đĩa than, meo meo mèo).

---

## 5. Camera Choreography & Chuyển Đổi Góc Nhìn

Sử dụng `CameraController.jsx` để điều khiển hoạt ảnh camera mượt mà không làm giật khung hình:

1. **Chế độ Mặc Định (Isometric Room View):**
   - `Position`: `[10, 10, 10]`
   - `Target`: `[0, 0.5, 0]`
   - `Zoom`: `80` (Desktop), tự động co giãn theo màn hình di động qua `useMobile.js`.
2. **Chế độ TV Arcade (Close-Up Screen View):**
   - Khi kích hoạt màn chơi game TV (`activePanel === 'playground'`), camera sẽ tự động dùng hàm nội suy **Ease-Out Cubic**:
     $$\text{easeOutCubic}(t) = 1 - (1 - t)^3$$
   - `Position`: `[1, 1.2, 3]`
   - `Target`: `[1, 1.2, -3.6]`
   - `Zoom`: `350`
   - Vô hiệu hóa `OrbitControls` để người dùng tập trung hoàn toàn vào màn hình game TV mà không vô tình xoay lệch camera.

---

## 6. Hệ Thống Nhân Vật Pixel (Pixel Person AI & Animations)

Nhân vật 3D được lắp ráp từ các khối Voxel thủ công (`VoxelCube`), có hệ thống xương giả lập hoạt họa (Head, Torso, Limbs):

### Các trạng thái sinh hoạt (Behavior FSM):
- **`walking`:** Di chuyển tuần tra quanh phòng theo các waypoint được xác định trước (`desk`, `window`, `bookshelf`, `bedside`).
- **`drinking_coffee`:** Đứng bên bàn làm việc, nâng cốc cà phê tỏa khói.
- **`petting_cat`:** Quỳ xuống cạnh giỏ mèo, vuốt ve chú mèo phát ra tiếng kêu rừ rừ.
- **`sitting_bed` / `sleeping`:** Tự động di chuyển đến giường và ngả lưng khi chuyển sang chế độ Night Mode.
- **`stretching`:** Vươn vai thư giãn sau thời gian làm việc.

### Tối ưu hóa hiệu năng Voxel:
- Áp dụng **Flyweight Pattern**: Chia sẻ duy nhất một đối tượng `BoxGeometry(1, 1, 1)` cho hàng chục chi tiết cơ thể người, giúp giảm số lượng draw calls từ hàng trăm xuống chỉ còn một vài instanced batch.

---

## 7. Tiêu Chí Nghiệm Thu & Kiểm Thử (Acceptance Criteria)

- [x] **FPS ổn định:** Duy trì ổn định 60 FPS trên màn hình máy tính thông thường và tối thiểu 45 FPS trên thiết bị di động tầm trung.
- [x] **Bóng đổ mềm:** `SceneLighting` cấu hình shadow map 1024x1024, không gây lag GPU khi đổi hướng ánh sáng.
- [x] **Giới hạn Camera:** Không cho phép xoay camera lộn ngược hoặc nhìn xuyên qua đáy sàn nhà.
- [x] **Không Rò Rỉ Bộ Nhớ:** Chuyển đổi liên tục giữa 4 kịch bản thời tiết không làm tăng dung lượng Heap Memory theo thời gian.

