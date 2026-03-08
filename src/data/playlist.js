/**
 * Music Playlist Data
 *
 * Nhạc được host trên Cloudinary (free 25GB, CDN toàn cầu)
 * Cách thêm nhạc mới:
 *   1. Vào Cloudinary → Media Library → Upload file .mp3
 *   2. Click vào file → Copy URL
 *   3. Dán URL đầy đủ vào src bên dưới
 */

export const playlist = [
  {
    id: 1,
    title: 'Giờ Thì',
    artist: 'Buitruonglinh',
    src: 'https://res.cloudinary.com/dackig67m/video/upload/v1772958656/giothi_kn1hch.mp3',
    duration: '3:54',
  },
  {
    id: 2,
    title: 'Love Language',
    artist: 'Kim MinSeok',
    src: 'https://res.cloudinary.com/dackig67m/video/upload/v1772958655/LoveLanguage_kyxlqi.mp3',
    duration: '3:05',
  },
  {
    id: 3,
    title: 'Nàng Thơ',
    artist: 'Hoàng Dũng',
    src: 'https://res.cloudinary.com/dackig67m/video/upload/v1772958656/NangTho_bhjxrq.mp3',
    duration: '5:21',
  },
  {
    id: 4,
    title: 'Round and Round',
    artist: 'JISOKURY',
    src: 'https://res.cloudinary.com/dackig67m/video/upload/v1772958656/RoundandRound_hmqsum.mp3',
    duration: '4:04',
  },
  {
    id: 5,
    title: 'Waltz for Moon',
    artist: 'Hodge',
    src: 'https://res.cloudinary.com/dackig67m/video/upload/v1772958656/WaltzforMoon_mnhodf.mp3',
    duration: '3:59',
  },
]

export default playlist
