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
    coverGradient: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
    themeColor: '#f59e0b',
    genre: 'Acoustic Indie',
  },
  {
    id: 2,
    title: 'Love Language',
    artist: 'Kim MinSeok',
    src: 'https://res.cloudinary.com/dackig67m/video/upload/v1772958655/LoveLanguage_kyxlqi.mp3',
    duration: '3:05',
    coverGradient: 'linear-gradient(135deg, #ec4899 0%, #9d174d 100%)',
    themeColor: '#ec4899',
    genre: 'K-R&B Chill',
  },
  {
    id: 3,
    title: 'Nàng Thơ',
    artist: 'Hoàng Dũng',
    src: 'https://res.cloudinary.com/dackig67m/video/upload/v1772958656/NangTho_bhjxrq.mp3',
    duration: '5:21',
    coverGradient: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
    themeColor: '#6366f1',
    genre: 'Ballad / Lo-Fi',
  },
  {
    id: 4,
    title: 'Round and Round',
    artist: 'JISOKURY',
    src: 'https://res.cloudinary.com/dackig67m/video/upload/v1772958656/RoundandRound_hmqsum.mp3',
    duration: '4:04',
    coverGradient: 'linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)',
    themeColor: '#06b6d4',
    genre: 'Dream Pop',
  },
  {
    id: 5,
    title: 'Waltz for Moon',
    artist: 'Hodge',
    src: 'https://res.cloudinary.com/dackig67m/video/upload/v1772958656/WaltzforMoon_mnhodf.mp3',
    duration: '3:59',
    coverGradient: 'linear-gradient(135deg, #8b5cf6 0%, #5b21b6 100%)',
    themeColor: '#8b5cf6',
    genre: 'Midnight Waltz',
  },
]

export default playlist
