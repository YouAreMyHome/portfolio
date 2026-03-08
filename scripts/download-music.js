/**
 * Script tải nhạc từ YouTube bằng yt-dlp
 * 
 * Cài đặt trước:
 *   1. yt-dlp: https://github.com/yt-dlp/yt-dlp/releases  (tải file .exe, thêm vào PATH)
 *   2. ffmpeg:  https://ffmpeg.org/download.html            (thêm vào PATH)
 * 
 * Chạy:
 *   node scripts/download-music.js
 */

import { execSync } from 'child_process'
import { existsSync, mkdirSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.resolve(__dirname, '../public/assets/music')

// ─── THÊM NHẠC VÀO ĐÂY ──────────────────────────────────────────────────────
// Format: { url: 'YouTube URL', filename: 'tên-file-output' }
// filename KHÔNG cần đuôi .mp3
const SONGS = [
  // Ví dụ:
  // { url: 'https://www.youtube.com/watch?v=XXXXX', filename: 'TenBaiHat' },
  // { url: 'https://www.youtube.com/watch?v=YYYYY', filename: 'BaiHatKhac' },
]
// ─────────────────────────────────────────────────────────────────────────────

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true })
}

if (SONGS.length === 0) {
  console.log('⚠️  Chưa có bài nhạc nào. Thêm vào mảng SONGS trong scripts/download-music.js')
  process.exit(0)
}

for (const song of SONGS) {
  const outputPath = path.join(OUTPUT_DIR, `${song.filename}.mp3`)

  if (existsSync(outputPath)) {
    console.log(`⏭️  Bỏ qua (đã tồn tại): ${song.filename}.mp3`)
    continue
  }

  console.log(`⬇️  Đang tải: ${song.filename}...`)
  try {
    execSync(
      `yt-dlp -x --audio-format mp3 --audio-quality 0 -o "${outputPath}" "${song.url}"`,
      { stdio: 'inherit' }
    )
    console.log(`✅ Đã lưu: ${song.filename}.mp3`)
  } catch (err) {
    console.error(`❌ Lỗi khi tải ${song.filename}:`, err.message)
  }
}

console.log('\n📁 Thư mục output:', OUTPUT_DIR)
console.log('📝 Nhớ cập nhật src/data/playlist.js với các file mới!')
