import { IMAGES } from './images'

/**
 * Danh sách ảnh kỷ niệm và câu chuyện đi kèm (Polaroid & Gallery)
 * Hỗ trợ song ngữ VI/EN, định dạng phân loại và thông số phong cách
 */
export const POLAROID_STORIES = [
  {
    id: 'polaroid1',
    src: IMAGES.polaroid1,
    title: {
      vi: 'Gia Đình Sum Họp Đón Xuân',
      en: 'Family Spring Reunion',
    },
    subtitle: {
      vi: 'Tết Nguyên Đán • Khoảnh khắc yêu thương',
      en: 'Lunar New Year • A Warm Gathering',
    },
    date: 'Tết Ất Tỵ 2025',
    location: {
      vi: 'Bến Tre, Việt Nam',
      en: 'Ben Tre, Vietnam',
    },
    category: {
      vi: 'Gia đình',
      en: 'Family',
    },
    note: {
      vi: 'Khoảnh khắc sum vầy đầy ấm áp bên bố mẹ và các anh em trước hiên nhà ngập tràn sắc hoa xuân. Mẹ diện tà áo dài truyền thống thướt tha, mọi người cùng mỉm cười rạng rỡ trao nhau lời chúc cho một năm mới an khang thịnh vượng và hạnh phúc.',
      en: 'A heartfelt reunion with parents and brothers in front of our home blooming with golden spring blossoms. Mother in an elegant traditional blue Ao Dai, all beaming with warm smiles and blessings for a peaceful and prosperous new year.',
    },
    camera: 'Analog 35mm • Natural Sunlight',
    tapeColor: '#f6bd60',
    rotation: -1.2,
  },
  {
    id: 'polaroid2',
    src: IMAGES.polaroid2,
    title: {
      vi: 'Kỷ Niệm Tuổi Thơ Vô Giá',
      en: 'Priceless Childhood Roots',
    },
    subtitle: {
      vi: 'Kỷ niệm gia đình bên ông bà',
      en: 'Cherished memories with grandparents',
    },
    date: 'Kỷ Niệm Năm Xưa',
    location: {
      vi: 'Đài Thánh Cả Giuse',
      en: 'St. Joseph Monument Grounds',
    },
    category: {
      vi: 'Kỷ niệm',
      en: 'Memories',
    },
    note: {
      vi: 'Bức ảnh kỷ niệm chụp cùng ông bà năm mình và các anh em còn bé xíu. Thời gian trôi đi thật nhanh, nhưng tình yêu thương bao la và lời dạy bảo của ông bà, cha mẹ luôn là điểm tựa vững chãi nhất trên từng chặng đường trưởng thành.',
      en: 'A vintage keepsake photograph with grandparents from our early childhood years. Time flies swiftly, but the unconditional warmth, love, and wisdom of family remain the bedrock of who I am today.',
    },
    camera: 'Vintage Kodak ColorPlus 200',
    tapeColor: '#84a59d',
    rotation: 1.5,
  },
  {
    id: 'frame1',
    src: IMAGES.frame1,
    title: {
      vi: 'Hoàng Hôn Trước Đại Dương',
      en: 'Ocean Sunset Contemplation',
    },
    subtitle: {
      vi: 'Lắng đọng chiều biển vắng',
      en: 'Serene coastal dusk breeze',
    },
    date: 'Mùa Hè 2024',
    location: {
      vi: 'Bờ kè biển Vũng Tàu',
      en: 'Vung Tau Coastline',
    },
    category: {
      vi: 'Hành trình',
      en: 'Journey',
    },
    note: {
      vi: 'Đứng một mình trước mênh mông biển cả lúc hoàng hôn buông xuống, sóng vỗ rì rào và làn gió biển mát lành. Đó là khoảnh khắc tĩnh lặng quý giá để nhìn lại chặng đường lập trình đã qua, nạp lại năng lượng cho những hoài bão lớn.',
      en: 'Standing before the vast horizon as the golden sun dips into the gentle waves. A quiet, contemplative moment to reflect on the coding journey, find peace in the breeze, and recharge for upcoming dreams.',
    },
    camera: 'Fujifilm Pro 400H • Warm Sunset Glow',
    tapeColor: '#f28482',
    rotation: 0,
  },
  {
    id: 'gallery1',
    src: IMAGES.gallery[0],
    title: {
      vi: 'Những Bước Chân Tuổi Trẻ',
      en: 'Youth & Milestones',
    },
    subtitle: {
      vi: 'Một ngày dạo phố tràn đầy năng lượng',
      en: 'A vibrant day out in the city',
    },
    date: 'Tháng 10 • 2024',
    location: {
      vi: 'TP. Hồ Chí Minh',
      en: 'Ho Chi Minh City',
    },
    category: {
      vi: 'Đời sống',
      en: 'Life',
    },
    note: {
      vi: 'Chụp lại những khoảnh khắc đời thường, giản dị nhưng ngập tràn sức trẻ và niềm đam mê sáng tạo công nghệ. Mỗi ngày trôi qua là một cơ hội mới để học hỏi và hoàn thiện bản thân.',
      en: 'Capturing candid everyday life moments filled with youth, enthusiasm, and a relentless passion for creative work. Every day is a fresh opportunity to learn and grow.',
    },
    camera: 'Street Photography • 35mm Prime',
    tapeColor: '#a7c957',
    rotation: -0.8,
  },
  {
    id: 'gallery2',
    src: IMAGES.gallery[1],
    title: {
      vi: 'Góc Nhìn Sáng Tạo',
      en: 'Creative Perspectives',
    },
    subtitle: {
      vi: 'Khoảnh khắc phía sau màn hình',
      en: 'Moments behind the screen',
    },
    date: 'Cuối năm 2024',
    location: {
      vi: 'Không gian sáng tạo',
      en: 'Creative Workspace',
    },
    category: {
      vi: 'Học tập',
      en: 'Learning',
    },
    note: {
      vi: 'Nơi những ý tưởng mã nguồn, đồ họa không gian 3D tương tác và kiến trúc phần mềm được ấp ủ và từng bước hiện thực hóa qua từng đêm miệt mài.',
      en: 'Where lines of code, interactive 3D spatial graphics, and software architectures are nurtured into real interactive experiences.',
    },
    camera: 'Studio Ambient Light • 50mm f/1.8',
    tapeColor: '#b5e2fa',
    rotation: 1.0,
  },
  {
    id: 'gallery3',
    src: IMAGES.gallery[2],
    title: {
      vi: 'Nụ Cười & Tương Lai',
      en: 'Smiles & Horizons',
    },
    subtitle: {
      vi: 'Lạc quan đón nhận thử thách',
      en: 'Embracing every challenge with optimism',
    },
    date: '2024',
    location: {
      vi: 'Sài Gòn',
      en: 'Saigon, Vietnam',
    },
    category: {
      vi: 'Đời sống',
      en: 'Life',
    },
    note: {
      vi: 'Nụ cười luôn là nguồn năng lượng tích cực nhất để vượt qua mọi thử thách trong học tập và kỹ thuật. Giữ vững tinh thần lạc quan và kiên trì theo đuổi ước mơ.',
      en: 'A genuine smile is the best fuel to overcome any challenge in learning and engineering. Staying optimistic and steadfast in pursuing dreams.',
    },
    camera: 'Candid Street Portrait',
    tapeColor: '#f7d070',
    rotation: -0.5,
  },
  {
    id: 'gallery4',
    src: IMAGES.gallery[3],
    title: {
      vi: 'Giai Điệu & Cảm Xúc',
      en: 'Melody & Reflections',
    },
    subtitle: {
      vi: 'Âm nhạc và những chiều suy tư',
      en: 'Music and reflective afternoons',
    },
    date: '2024',
    location: {
      vi: 'TP. Hồ Chí Minh',
      en: 'Ho Chi Minh City',
    },
    category: {
      vi: 'Nghệ thuật',
      en: 'Art',
    },
    note: {
      vi: 'Âm nhạc luôn đồng hành cùng mình trong từng dòng code và từng dự án web tương tác, giúp tâm hồn thư thái và khơi nguồn cảm hứng bất tận.',
      en: 'Music always accompanies every line of code and every interactive 3D web experience, soothing the mind and sparking endless creative inspiration.',
    },
    camera: 'Monochrome Subtle Glow',
    tapeColor: '#e0a96d',
    rotation: 0.6,
  },
]

/**
 * Tìm kiếm hoặc chuẩn hóa đối tượng ảnh thành item chuẩn POLAROID_STORIES
 */
export function normalizePolaroidItem(rawItem, fallbackIndex = 0) {
  if (!rawItem) {
    return POLAROID_STORIES[fallbackIndex % POLAROID_STORIES.length]
  }

  // Nếu đã là object có đủ thuộc tính
  if (typeof rawItem === 'object' && rawItem.src && rawItem.title) {
    return rawItem
  }

  const srcUrl = typeof rawItem === 'string' ? rawItem : rawItem.src

  // Tìm trong danh sách có sẵn theo URL
  const found = POLAROID_STORIES.find((item) => item.src === srcUrl)
  if (found) {
    return found
  }

  // Tạo đối tượng mặc định nếu URL bên ngoài
  return {
    id: `photo_${fallbackIndex}`,
    src: srcUrl,
    title: {
      vi: `Khoảnh Khắc Kỷ Niệm #${fallbackIndex + 1}`,
      en: `Cherished Memory #${fallbackIndex + 1}`,
    },
    subtitle: {
      vi: 'Kỷ niệm từ bộ sưu tập',
      en: 'From the photo gallery',
    },
    date: 'Khoảnh khắc đáng nhớ',
    location: {
      vi: 'Việt Nam',
      en: 'Vietnam',
    },
    category: {
      vi: 'Kỷ niệm',
      en: 'Memories',
    },
    note: {
      vi: 'Mỗi bức ảnh là một mảnh ghép ký ức tuyệt đẹp ghi dấu hành trình đã qua.',
      en: 'Every photograph is a priceless fragment of memory along the journey.',
    },
    camera: 'Classic Polaroid Color',
    tapeColor: ['#f6bd60', '#84a59d', '#f28482', '#a7c957', '#b5e2fa'][fallbackIndex % 5],
    rotation: (fallbackIndex % 2 === 0 ? -1 : 1) * 1.2,
  }
}

export default POLAROID_STORIES
