/**
 * Books Data — Dev jokes, memes & easter egg
 *
 * Tách riêng khỏi portfolio.js để dễ bảo trì.
 * Thêm sách mới: chỉ cần thêm object vào mảng bên dưới.
 *
 * Các field:
 *  - id         : unique number
 *  - title      : tên sách (dùng tên sách lập trình thật để thêm vibe)
 *  - color      : màu gáy sách (hex)
 *  - content    : mảng string — jokes / memes / wisdom
 *  - type       : 'jokes' | 'memes' | 'wisdom' | 'life' | 'errors' | 'mystery'
 *  - isRickRoll : (optional) true → click sẽ mở Rick Roll thay vì đọc sách
 */

export const books = [
  {
    id: 1,
    title: "Clean Code",
    color: "#e74c3c",
    content: [
      "Tại sao lập trình viên thích dark mode? Vì bugs sợ ánh sáng! 🐛",
      "CSS là viết tắt của: Can't Stop Suffering 😭",
      "Có 10 loại người trên thế giới: người hiểu binary và người không.",
    ],
    type: "jokes",
  },
  {
    id: 2,
    title: "Design Patterns",
    color: "#3498db",
    content: [
      "'It works on my machine' - Famous last words 💀",
      "Senior dev: 'Đây là code legacy' \nJunior dev: 'Sao anh viết tuần trước mà?' 🤡",
      "Deadline ngày mai → Code chạy được → Không hiểu tại sao → Không động vào nữa",
    ],
    type: "memes",
  },
  {
    id: 3,
    title: "The Pragmatic Programmer",
    color: "#2ecc71",
    content: [
      "Đọc code của mình 6 tháng trước giống như đọc code người lạ viết 👽",
      "99 bugs trên wall, bắt 1 con xuống... 127 bugs trên wall 🐛",
      "Copy từ StackOverflow không phải là cheating, đó là 'code reuse' 😎",
    ],
    type: "wisdom",
  },
  {
    id: 4,
    title: "JavaScript: The Good Parts",
    color: "#9b59b6",
    content: [
      "Họp 2 tiếng để quyết định dùng tabs hay spaces 📊",
      "Fix 1 bug, thêm 3 features (không ai yêu cầu) 🎁",
      "'Chỉ cần 5 phút' = Ít nhất 3 tiếng ⏰",
    ],
    type: "life",
  },
  {
    id: 5,
    title: "You Don't Know JS",
    color: "#f39c12",
    content: [
      "Error: Success! (Wait what? 🤔)",
      "Cannot read property 'undefined' of undefined - Tôi undefined, bạn undefined 🎭",
      "Segmentation fault (core dumped) - Dịch: Chúc may mắn lần sau 🍀",
    ],
    type: "errors",
  },
  {
    id: 6,
    title: "Advanced Algorithms",
    color: "#1abc9c",
    content: [
      "Bạn có chắc muốn mở cuốn sách này không? 👀",
      "Có thể có điều bất ngờ đang chờ đợi...",
      "CẢNH BÁO: Không thể hoàn tác! 🚨",
    ],
    type: "mystery",
    isRickRoll: true,
  },
]

export default books
