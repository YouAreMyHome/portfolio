# HƯỚNG DẪN KIẾN TRÚC & TIÊU CHUẨN PHÁT TRIỂN (GEMINI AGENT SYSTEM PROMPT & RULES)

> **Dự án:** The Dev's Pixel Room (3D Isometric Interactive Portfolio)  
> **Phiên bản:** v2.0.0 Architecture Overhaul  
> **Mục tiêu:** 60 FPS WebGL, Modular Architecture, Low Draw Calls, Zero Technical Debt.  
> **Tài liệu tham chiếu:** [`docs/spec/`](file:///e:/Project/portfolio-1/docs/spec/) và Kế hoạch bảo trì toàn diện.

Tập tin này định nghĩa các nguyên tắc thiết kế, cấu trúc thư mục, mẫu thiết kế (Design Patterns) và các ràng buộc kỹ thuật bắt buộc mà mọi **Gemini Agent** (hoặc AI Coding Assistant) phải tuân thủ nghiêm ngặt khi đọc, sửa đổi hoặc mở rộng mã nguồn dự án này.

---

## 1. CÔNG NGHỆ CỐT LÕI & RÀNG BUỘC PHIÊN BẢN (TECH STACK)

- **Frontend Core:** React 18 (`react`, `react-dom`)
- **3D Graphics & Engine:** Three.js (`r170`), React Three Fiber (`@react-three/fiber` v8), Drei (`@react-three/drei` v9)
- **State Management:** Zustand v4 (Phân tách theo Kiến trúc Slices)
- **Event Bus:** Custom Pub-Sub Pattern ([`src/utils/eventBus.js`](file:///e:/Project/portfolio-1/src/utils/eventBus.js))
- **Build Tool:** Vite 5 (Cấu hình `manualChunks` cô lập Supabase và 3D vendor)
- **Styling & Motion:** TailwindCSS v3, Framer Motion v11, Lucide React icons
- **Backend / Data Layer:** Supabase (`@supabase/supabase-js` v2) kèm LocalStorage cache fallback
- **Localization:** `react-i18next` & `i18next` (`vi` / `en`)

---

## 2. BẢN ĐỒ CẤU TRÚC THƯ MỤC CHUẨN (PROJECT DIRECTORY BLUEPRINT)

Khi tạo file mới hoặc tái cấu trúc, bắt buộc đặt đúng vị trí theo quy hoạch sau:

```
portfolio-1/
├── GEMINI.md                           # <--- File kim chỉ nam cho Agent này
├── eslint.config.js                    # ESLint 9 Flat Config (JS/JSX)
├── vite.config.js                      # Cấu hình chunks và tối ưu build
├── src/
│   ├── App.jsx                         # App root, SoundSystem qua Event Bus
│   ├── main.jsx                        # Entry point React DOM & i18n
│   ├── components/
│   │   ├── Room/                       # Không gian 3D Three.js / R3F
│   │   │   ├── pools/                  # [Flyweight Pattern] Cache Geometries & Materials dùng chung
│   │   │   │   ├── GeometryPool.js
│   │   │   │   └── MaterialPool.js
│   │   │   ├── games/                  # 4 trò chơi mini arcade (Snake, Pong, Dino, Tetris)
│   │   │   │   └── constants.js        # getGameLang() và hằng số game
│   │   │   ├── PixelPerson/            # Nhân vật 3D, FSM hook, kinematics
│   │   │   ├── Floor.jsx               # InstancedMesh cho ván sàn & tua rua thảm
│   │   │   ├── Walls.jsx               # Tường phòng (matrixAutoUpdate = false)
│   │   │   ├── DeskSetup.jsx           # Bàn làm việc, case PC, dual monitor
│   │   │   ├── InteractiveObject.jsx   # Wrapper hover/click với idle throttling
│   │   │   └── ...
│   │   ├── Panels/                     # [Modular Panels] Các tab nội dung độc lập
│   │   │   ├── AboutPanel.jsx
│   │   │   ├── ProjectsPanel.jsx
│   │   │   ├── SkillsPanel.jsx
│   │   │   ├── BooksPanel.jsx
│   │   │   ├── PlaygroundPanel.jsx
│   │   │   ├── ContactPanel.jsx
│   │   │   └── index.js
│   │   ├── PortfolioOS/                # [Compound Component Pattern] Hệ điều hành giả lập
│   │   │   ├── OSWindow.jsx            # Cửa sổ desktop kéo thả dùng chung
│   │   │   ├── PortfolioOS.jsx         # Desktop Coordinator (Taskbar, Start Menu, Grid)
│   │   │   └── apps/                   # Ứng dụng con của OS (Terminal, Projects, Skills...)
│   │   ├── UI/                         # Giao diện HUD 2D & Modal Overlays
│   │   │   ├── PanelOverlay.jsx        # Wrapper mỏng điều phối src/components/Panels
│   │   │   ├── PolaroidLightbox.jsx    # Thư viện ảnh Polaroid
│   │   │   ├── MusicPlayer.jsx         # Trình phát nhạc Lo-Fi
│   │   │   ├── PhotoMode.jsx           # Chế độ chụp ảnh phòng 3D
│   │   │   ├── GuestbookOverlay.jsx    # Sổ lưu niệm khách truy cập
│   │   │   └── KanbanOverlay.jsx       # Bảng công việc cá nhân
│   │   └── Admin/                      # CMS quản trị dữ liệu (Project, Skill, Settings)
│   ├── store/
│   │   ├── slices/                     # [Zustand Slices Architecture]
│   │   │   ├── uiSlice.js              # Active panels, zoom, tooltip, welcome
│   │   │   ├── themeSlice.js           # Lighting presets, night mode, pixel shader
│   │   │   ├── characterSlice.js       # Hành vi nhân vật, chu kỳ ngủ/thức
│   │   │   ├── loadingSlice.js         # Tài nguyên tải phòng, benchmark
│   │   │   └── overlaySlice.js         # Modal overlays
│   │   └── useStore.js                 # Store hợp nhất từ các slices
│   ├── services/                       # [Data & Repository Layer]
│   │   ├── supabaseClient.js           # Supabase client an toàn
│   │   └── dataService.js              # Repository truy xuất dữ liệu + LocalStorage cache
│   └── utils/
│       ├── eventBus.js                 # [Pub-Sub] Audio & Analytics side-effects
│       └── useSounds.js                # Hook âm thanh giao tiếp qua eventBus
```

---

## 3. CÁC QUY TẮC BẮT BUỘC KHI VIẾT CODE (AGENT CODING RULES)

### 3.1. Quy Tắc Đồ Họa 3D & WebGL (Three.js / React Three Fiber)
1. **Tuyệt đối không cấp phát lặp lại trong Render Loop (`useFrame`):**
   - Không được `new THREE.Vector3()`, `new THREE.Color()`, hoặc `new THREE.Matrix4()` bên trong `useFrame`. Luôn khai báo biến đệm bằng `useRef` hoặc bên ngoài component.
2. **Áp dụng Flyweight Pattern cho Geometries & Materials:**
   - Trước khi tạo thẻ `<boxGeometry>` hoặc `<meshStandardMaterial>`, kiểm tra và ưu tiên sử dụng bộ nhớ dùng chung tại [`src/components/Room/pools/GeometryPool.js`](file:///e:/Project/portfolio-1/src/components/Room/pools/GeometryPool.js) và [`MaterialPool.js`](file:///e:/Project/portfolio-1/src/components/Room/pools/MaterialPool.js).
3. **Bắt buộc dùng `InstancedMesh` cho đối tượng lặp lại:**
   - Bất kỳ nhóm đối tượng nào có số lượng $\ge 5$ mesh giống hình dạng (như nan gỗ sàn, sợi tua rua thảm, hạt hơi nước bốc lên, cánh lá cây, sách trên giá) **bắt buộc** phải gộp thành `instancedMesh` để giảm thiểu Draw Calls.
4. **Không tùy tiện dùng `matrixAutoUpdate={false}` trong JSX R3F:**
   - Trong React Three Fiber, các thuộc tính `position`, `rotation`, `scale` được R3F gán vào `object`. Nếu đặt `matrixAutoUpdate={false}` trực tiếp trong JSX, Three.js sẽ **bỏ qua** việc tính ma trận cục bộ và giữ nguyên ma trận đơn vị (`Identity Matrix`), khiến vật thể bị văng về tọa độ `(0, 0, 0)` và làm biến dạng hoàn toàn không gian phòng 3D.
   - Để Three.js tự động cập nhật ma trận một cách an toàn cho các component JSX (overhead cập nhật ma trận của vài chục mesh tĩnh là không đáng kể, < 0.005ms).
5. **Idle Throttling cho Animated/Interactive Objects:**
   - Trong `InteractiveObject.jsx` và các đối tượng có hiệu ứng nâng/xoay khi hover, sử dụng cờ trạng thái (ví dụ `isMoving`) để dừng các phép tính nội suy `THREE.MathUtils.lerp` khi vật thể đã đạt đến vị trí nghỉ.
6. **Không dùng N8AO với Orthographic Camera & Giữ Bloom LuminanceThreshold $\ge 1.0$:**
   - Trong camera trực giao (Orthographic), bộ đệm độ sâu là tuyến tính (linear depth), N8AO sẽ tính sai normal/depth khi xoay camera và sinh giá trị `NaN` tràn vào buffer `mipmapBlur` của `Bloom`, gây hiện tượng chớp vàng/chớp trắng toàn màn hình.
   - Dự án đã có sẵn `ContactShadows` trong `Room.jsx`. Giữ `Bloom` ở ngưỡng `luminanceThreshold={1.05}` để chỉ các vật thể phát sáng (emissive/LED/màn hình) mới phát quang, tuyệt đối không để ngưỡng $< 1.0$ vì sẽ kích hoạt bloom trên bề mặt ván sàn và tường khi xoay camera.

### 3.2. Quy Tắc Quản Lý Trạng Thái (Zustand & Event Bus)
1. **Không tạo Monolithic Store:**
   - Mọi state mới phải được đặt vào đúng Slice trong [`src/store/slices/`](file:///e:/Project/portfolio-1/src/store/slices/). Nếu là tính năng mới hoàn toàn độc lập, tạo slice mới `createXxxSlice.js` và import vào `useStore.js`.
2. **Nguyên tắc State Thuần Khiết (Serializable Only):**
   - Tuyệt đối **không** lưu trữ hàm callback (`onSoundTrigger`, `callback`), DOM element, hoặc instance Three.js trực tiếp vào Zustand state.
3. **Phát âm thanh & sự kiện qua Event Bus:**
   - Để kích hoạt âm thanh, gọi `emitSound('click')` hoặc `eventBus.emit(APP_EVENTS.AUDIO_PLAY, 'tên_sound')`.
   - Để ghi nhận analytics, gọi `emitAnalytics('tên_event', data)`.
   - Store chỉ nắm giữ trạng thái giao diện, không đảm nhận việc kích hoạt âm thanh trực tiếp.

### 3.3. Quy Tắc Phân Tách Giao Diện (React UI & Compound Pattern)
1. **Nguyên tắc "Cửa sổ & Ứng dụng" trong PortfolioOS:**
   - Mọi ứng dụng mới trong hệ điều hành máy tính ảo (PortfolioOS) phải được tạo thành một file component riêng trong [`src/components/PortfolioOS/apps/`](file:///e:/Project/portfolio-1/src/components/PortfolioOS/apps/) và sử dụng wrapper [`OSWindow.jsx`](file:///e:/Project/portfolio-1/src/components/PortfolioOS/OSWindow.jsx).
2. **Nguyên tắc "Single Responsibility" cho Panels:**
   - Không nhồi nhét nội dung modal trực tiếp vào `PanelOverlay.jsx`. Hãy tạo component mới trong [`src/components/Panels/`](file:///e:/Project/portfolio-1/src/components/Panels/) và đăng ký tại `src/components/Panels/index.js`.

### 3.4. Quy Tắc Tầng Dữ Liệu & Bundle Optimization (Vite & Supabase)
1. **Không import nặng làm phình Entry Chunk:**
   - Thư viện Supabase SDK đã được cô lập qua `manualChunks: { 'vendor-supabase': ['@supabase/supabase-js'] }`. Tuyệt đối không import `@supabase/supabase-js` trực tiếp vào các component 3D hoặc UI hiển thị tức thì. Mọi truy vấn phải đi qua [`src/services/dataService.js`](file:///e:/Project/portfolio-1/src/services/dataService.js).
2. **Offline-first & LocalStorage Fallback:**
   - Khi đọc/ghi dữ liệu (Projects, Skills, Playlist, Guestbook), luôn bảo đảm có phương án fallback qua LocalStorage nếu Supabase chưa được cấu hình hoặc gặp sự cố mất mạng.

### 3.5. Quy Tắc Đa Ngôn Ngữ & Bản Địa Hóa (i18n)
1. Mọi nhãn văn bản (UI label, tiêu đề, mô tả, thông báo lỗi) hiển thị cho người dùng phải dùng `useTranslation()` từ `react-i18next`.
2. Khi thêm key ngôn ngữ mới, bắt buộc cập nhật đồng thời cả hai tệp:
   - `src/i18n/locales/vi/common.json`
   - `src/i18n/locales/en/common.json`
3. Trong các mini-game của phòng 3D, sử dụng hàm dùng chung `getGameLang(i18n.language)` từ [`src/components/Room/games/constants.js`](file:///e:/Project/portfolio-1/src/components/Room/games/constants.js).

---

## 4. QUY TRÌNH KIỂM SOÁT CHẤT LƯỢNG TRƯỚC KHI BÀN GIAO (QUALITY GATE)

Trước khi Gemini Agent thông báo hoàn thành bất kỳ nhiệm vụ nào cho User, **bắt buộc** phải tự động chạy và vượt qua 2 bước kiểm tra sau trong sandbox:

1. **Lệnh kiểm tra cú pháp và quy chuẩn React Hooks:**
   ```bash
   npm run lint
   ```
   *Yêu cầu:* Phải kết thúc với **0 errors** và **0 warnings**. Nếu xuất hiện cảnh báo `react-hooks/exhaustive-deps` hoặc `no-unused-vars`, phải sửa triệt để trước khi chuyển bước.

2. **Lệnh kiểm tra đóng gói Production:**
   ```bash
   npm run build
   ```
   *Yêu cầu:* Quá trình biên dịch Vite phải hoàn thành thành công (`exit code 0`), không xuất hiện lỗi thiếu module, lỗi cú pháp JSX, hoặc chunk bị phình quá cỡ.

---

## 5. MẪU THIẾT KẾ CODE MẪU CHO AGENT THAM KHẢO

### Mẫu 1: Tạo một vật thể 3D tiết kiệm hiệu năng
```jsx
import { GeometryPool } from './pools/GeometryPool'
import { MaterialPool } from './pools/MaterialPool'

export default function StaticBookshelf({ position, rotation }) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      geometry={GeometryPool.box(1.2, 2.0, 0.4)}
      material={MaterialPool.woodDark}
      castShadow
      receiveShadow
    />
  )
}
```

### Mẫu 2: Bắn sự kiện âm thanh và phân tách state
```jsx
import useStore from '../../store/useStore'
import { emitSound } from '../../utils/eventBus'

export default function MyControlWidget() {
  const activePanel = useStore((state) => state.activePanel)
  const setActivePanel = useStore((state) => state.setActivePanel)

  const handleOpen = () => {
    emitSound('panelOpen') // <--- Sử dụng Event Bus, không gọi qua state
    setActivePanel('projects')
  }

  return <button onClick={handleOpen}>Open Projects</button>
}
```

