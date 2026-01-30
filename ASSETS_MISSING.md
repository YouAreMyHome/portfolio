ASSETS CHECKLIST FOR Flappy_cat

Tổng quan: danh sách asset hiện có và các file/loại file còn thiếu để build game Flappy-style.

1) Asset hiện có (theo `public/assets/game/Flappy_cat`):
- Player sprites: `Popo-AnimationSheet.png`, `SuperKucingFlyingAnimation.gif`
- Background / Parallax: `Clouds 1` .. `Clouds 8` (thư mục chứa nhiều PNG)
- Pipes (obstacles): `pipe/pipe-green.png`, `pipe/pipe-red.png`
- Coins (collectibles): `Coin/coin1.png` .. `coin10.png`
- Score digits: `Score/0.png` .. `Score/9.png`
- Game over image: `gameover.png`

2) Asset còn thiếu / khuyến nghị (NO GROUND theo yêu cầu):
- UI buttons & icons:
  - `btn_play.png`, `btn_retry.png` (hoặc `btn_restart.png`)
  - `icon_sound_on.png`, `icon_sound_off.png` (mute/unmute)
  - `btn_pause.png` (optional)
  - `overlay_pause.png` hoặc `panel_popup.png` (pause/confirm)
  - `tap_to_start.png` hoặc frame hướng dẫn (optional)

- Sound & Music (rất khuyến nghị):
  - SFX: flap, point (score), coin, hit/collide, die
  - BGM: short loop cho menu/play
  - Định dạng: `.ogg` + `.mp3` để tương thích web

- Sprite metadata / atlas (nếu sử dụng spritesheet):
  - `Popo-AnimationSheet.json` (hoặc tương đương) để xác định frame sizes, hoặc tách từng frame PNG nếu không dùng metadata

- Font / Bitmap font:
  - Nếu muốn hiển thị text native (UI, score), thêm TTF/WOFF hoặc 1 bitmap font nếu muốn phong cách cổ điển

- Retina / @2x variants (tuỳ chọn nhưng khuyến nghị):
  - @2x cho player, pipes, coins, background layers

- Particle / effect sprites (tuỳ chọn):
  - `spark.png`, `smoke.png` hoặc sheet nhỏ cho hiệu ứng khi ăn coin/va chạm

- Misc:
  - `icon_share.png` / `icon_leaderboard.png` (nếu cần integrate)
  - Screenshot / preview image cho store hoặc trang showcase

3) Ghi chú kỹ thuật ngắn
- Bạn có thể lật pipe để tạo pipe trên (flip Y) mà không cần asset thêm.
- Nếu `Popo-AnimationSheet.png` có các frame đều kích thước, metadata JSON không bắt buộc; code có thể cắt bằng grid.
- Âm thanh: chuẩn hóa tên file và đặt trong `public/assets/audio/flappy_cat/` để loader dễ đọc.

4) Next steps (tôi có thể làm giúp):
- Tạo placeholder PNG cho các UI icons (kích thước chuẩn web) để bạn test.
- Tạo `Popo-AnimationSheet.json` giả nếu bạn muốn dùng atlas metadata.
- Thêm README ngắn hướng dẫn naming convention + đường dẫn assets.

Nếu bạn muốn tôi tạo placeholders (icons + simple JSON atlas + folder audio placeholder), nói "tạo placeholders" — tôi sẽ triển khai trực tiếp trong repo.

## How to open the game in the app

The repository already includes a route `/fun-game` in `src/App.jsx` that now renders the Flappy Cat page.

To run locally (from project root):

1. Install deps if needed: `npm install` or `pnpm install`.
2. Start dev server: `npm run dev` (or the start script you use for this project).
3. Open `http://localhost:3000` (or the address printed by Vite) and navigate to "Fun Game" in the site menu or visit `/fun-game`.

The game uses assets from `public/assets/game/Flappy_cat` so ensure that folder is present (it already is in this repo).
