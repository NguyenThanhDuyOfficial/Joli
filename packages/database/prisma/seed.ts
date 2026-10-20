import { prisma } from "./prisma.js";

// ─────────────────────────────────────────────────────────────
// IMAGE POOLS (giữ nguyên từ thể loại.txt)
// ─────────────────────────────────────────────────────────────
const COLOGNE_IMAGES = [
  "https://images.unsplash.com/photo-1737916061048-5a288b8e9f26?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1618606406819-8db8d03ac980?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1743763344153-b21751aecb34?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1608434292452-0f1ba857d274?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1591892142072-5ae9222659b0?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1588482587611-692b19ee797b?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1610461888750-10bfc601b874?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1674318881563-84ba1a53d9c4?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1732828912683-57104a2d1b4b?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1704900164098-33c4abb6a579?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1606391375467-88ff0886729f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
];

const CANDLE_IMAGES = [
  "https://images.unsplash.com/photo-1707839568483-9f1924d5f5de?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1692366085082-a35e3a1d4a1b?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1609972815868-9676b35b648e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1631624401804-9654cc83aabc?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1612634824306-30115acfb10c?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1692651515599-8f62709073bf?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1688152971901-2f9d80d82e1e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1625666797667-ac1ea2a400b3?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1714228499605-367154d9bdb2?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1604172083143-081d302edb4d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
];

const BODY_WASH_IMAGES = [
  "https://images.unsplash.com/photo-1700709678003-01941f72fb92?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1676192652081-078b0a707654?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1761125802333-d145773f4461?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1677725281475-c2931146035c?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1604454992711-f4784c045bec?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1738340319117-6216cb2cf236?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1721403396830-d290f04c08a4?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1755655618085-e0267f9fbd81?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1624988344985-b7d6db635411?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1682684096929-f1b5e69eda17?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
];

const DIFFUSER_IMAGES = [
  "https://images.unsplash.com/photo-1660853041560-69efa3512a05?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1660939966498-385de0357e6d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1655119294114-60412e041e1e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1660853142320-33ee03871bc9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1626764465449-97863182a6a2?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1626764465314-a27d5422a4da?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1616817727790-4cc1975d00cc?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1576683395780-1bc526dc6609?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1660853142034-3fc45895499a?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1660853142144-2298f993efcb?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
];

// ─────────────────────────────────────────────────────────────
// CATEGORY DEFINITIONS
// ─────────────────────────────────────────────────────────────
type VariantDef = {
  size: string;
  /** Hệ số nhân so với giá gốc (size chuẩn = 1.0) */
  multiplier: number;
};

type CategoryDef = {
  name: string;
  slug: string;
  description: string;
  basePrice: [number, number]; // VND cho size chuẩn
  variants: VariantDef[];
  /** Key trong IMAGES_MAP — cho phép category mới dùng lại ảnh */
  imageSource: string;
  productNames: string[];
};

const CATEGORIES: CategoryDef[] = [
  // ── 1. COLOGNES ─────────────────────────────────────────
  {
    name: "Colognes",
    slug: "colognes",
    description: "Nước hoa cao cấp với hương thơm tinh tế, lưu hương lâu.",
    basePrice: [500_000, 2_500_000],
    imageSource: "colognes",
    variants: [
      { size: "30ml", multiplier: 0.7 },
      { size: "50ml", multiplier: 1.0 },
      { size: "100ml", multiplier: 1.8 },
    ],
    productNames: [
      "Hương Gỗ Đàn Hương",
      "Hương Hoa Hồng Đen",
      "Hương Xạ Hương Trắng",
      "Hương Cam Bergamot",
      "Hương Cỏ Vetiver",
      "Hương Gỗ Tuyết Tùng",
      "Hương Hoa Nhài Đêm",
      "Hương Da Thuộc",
      "Hương Biển Khơi",
      "Hương Vani Hoắc Hương",
      "Hương Trầm Hương",
      "Hương Hoa Oải Hương",
      "Hương Gỗ Sồi",
      "Hương Quả Sung",
      "Hương Hoa Cam",
      "Hương Gỗ Hồng Đào",
      "Hương Xạ Hương Đen",
      "Hương Gừng Ấm",
      "Hương Hoa Nhài Trắng",
      "Hương Gỗ Trầm",
      "Hương Hoa Hồng Trắng",
      "Hương Quế Ấm",
      "Hương Cỏ Xạ Hương",
      "Hương Gỗ Đàn Hương Ấn Độ",
      "Hương Hoa Ngọc Lan",
    ],
  },

  // ── 2. CANDLES ──────────────────────────────────────────
  {
    name: "Candles",
    slug: "candle",
    description: "Nến thơm thủ công mang lại không gian ấm cúng, thư giãn.",
    basePrice: [200_000, 700_000],
    imageSource: "candle",
    variants: [
      { size: "100g", multiplier: 0.6 },
      { size: "200g", multiplier: 1.0 },
      { size: "400g", multiplier: 1.7 },
    ],
    productNames: [
      "Nến Vani Hạt Đậu",
      "Nến Gỗ Đàn Hương",
      "Nến Cánh Đồng Oải Hương",
      "Nến Quả Sung Nho Đen",
      "Nến Trà Bergamot",
      "Nến Vải Lanh Tươi",
      "Nến Khói Gỗ",
      "Nến Vườn Hồng",
      "Nến Vườn Cam Quýt",
      "Nến Hổ Phách Ấm",
      "Nến Trà Trắng",
      "Nến Bạch Đàn Bạc Hà",
      "Nến Lá Sung",
      "Nến Tuyết Tùng Hổ Phách",
      "Nến Chanh Verbena",
      "Nến Nhài Neroli",
      "Nến Đàn Hương Vani",
      "Nến Rừng Tre",
      "Nến Hoa Hồng Trầm",
      "Nến Oải Hương Cúc",
      "Nến Quế Táo",
      "Nến Vani Bourbon",
      "Nến Gỗ Khói Trầm",
      "Nến Hoa Mộc Tê",
      "Nến Cam Đỏ",
    ],
  },

  // ── 3. BODY & HAND WASH ─────────────────────────────────
  {
    name: "Body & Hand Wash",
    slug: "body-hand-wash",
    description: "Sữa tắm & nước rửa tay dịu nhẹ, nuôi dưỡng làn da.",
    basePrice: [150_000, 500_000],
    imageSource: "body-hand-wash",
    variants: [
      { size: "250ml", multiplier: 1.0 },
      { size: "500ml", multiplier: 1.7 },
    ],
    productNames: [
      "Sữa Tắm Muối Biển Xô Thơm",
      "Sữa Tắm Chanh Verbena",
      "Sữa Tắm Oải Hương Dịu Êm",
      "Sữa Tắm Cánh Hồng",
      "Sữa Tắm Trà Xanh",
      "Sữa Tắm Dừa Sữa",
      "Sữa Tắm Than Hoạt Tính",
      "Sữa Tắm Nha Đam Dưa Leo",
      "Sữa Tắm Bơ Hạt Mỡ",
      "Sữa Tắm Bạc Hà Tươi",
      "Sữa Tắm Gạo Sữa",
      "Sữa Tắm Yến Mạch",
      "Sữa Tắm Hoa Anh Đào",
      "Sữa Tắm Cam Quýt",
      "Sữa Tắm Bưởi Hồng",
      "Sữa Tắm Nghệ",
      "Sữa Tắm Sả Chanh",
      "Sữa Tắm Hoa Nhài",
      "Sữa Tắm Trà Trắng",
      "Sữa Tắm Sen Hồng",
      "Sữa Tắm Hoa Cúc",
      "Sữa Tắm Đào Trắng",
      "Sữa Tắm Sô-cô-la",
      "Sữa Tắm Mật Ong",
      "Sữa Tắm Hạnh Nhân",
    ],
  },

  // ── 4. DIFFUSERS & REFILLS ──────────────────────────────
  {
    name: "Diffusers & Refills",
    slug: "diffusers-refills",
    description: "Tinh dầu thơm phòng & nước refill, giữ hương thơm bền lâu.",
    basePrice: [300_000, 900_000],
    imageSource: "diffusers-refills",
    variants: [
      { size: "100ml", multiplier: 1.0 },
      { size: "200ml", multiplier: 1.8 },
    ],
    productNames: [
      "Tinh Dầu Trà Trắng",
      "Tinh Dầu Bạch Đàn Bạc Hà",
      "Tinh Dầu Lá Sung",
      "Tinh Dầu Tuyết Tùng Hổ Phách",
      "Tinh Dầu Chanh Verbena",
      "Tinh Dầu Nhài Neroli",
      "Tinh Dầu Đàn Hương Vani",
      "Tinh Dầu Rừng Tre",
      "Tinh Dầu Hoa Hồng Trầm",
      "Tinh Dầu Oải Hương Cúc",
      "Tinh Dầu Cam Bergamot",
      "Tinh Dầu Hoa Mộc Tê",
      "Tinh Dầu Gỗ Đàn Hương",
      "Tinh Dầu Chanh Sả",
      "Tinh Dầu Bạc Hà",
      "Tinh Dầu Quế",
      "Tinh Dầu Đinh Hương",
      "Tinh Dầu Hoa Nhài",
      "Tinh Dầu Hoa Hồng",
      "Tinh Dầu Hoa Oải Hương",
      "Tinh Dầu Gừng",
      "Tinh Dầu Chanh Dây",
      "Tinh Dầu Cam Ngọt",
      "Tinh Dầu Bưởi",
      "Tinh Dầu Quýt",
    ],
  },

  // ── 5. HAND CREAMS 🆕 ────────────────────────────────────
  {
    name: "Hand Creams",
    slug: "hand-creams",
    description: "Kem dưỡng tay mềm mịn, thấm nhanh, không gây nhờn dính.",
    basePrice: [120_000, 400_000],
    imageSource: "body-hand-wash", // dùng lại ảnh pool body wash
    variants: [
      { size: "30ml", multiplier: 1.0 },
      { size: "75ml", multiplier: 2.0 },
    ],
    productNames: [
      "Kem Dưỡng Tay Hoa Hồng",
      "Kem Dưỡng Tay Bơ Hạt Mỡ",
      "Kem Dưỡng Tay Oải Hương",
      "Kem Dưỡng Tay Trà Xanh",
      "Kem Dưỡng Tay Dừa",
      "Kem Dưỡng Tay Yến Mạch",
      "Kem Dưỡng Tay Nha Đam",
      "Kem Dưỡng Tay Cam Quýt",
      "Kem Dưỡng Tay Đào Trắng",
      "Kem Dưỡng Tay Mật Ong",
      "Kem Dưỡng Tay Bạc Hà",
      "Kem Dưỡng Tay Sả Chanh",
      "Kem Dưỡng Tay Hạnh Nhân",
      "Kem Dưỡng Tay Vani",
      "Kem Dưỡng Tay Gừng",
      "Kem Dưỡng Tay Quế",
      "Kem Dưỡng Tay Hoa Nhài",
      "Kem Dưỡng Tay Trà Trắng",
      "Kem Dưỡng Tay Hoa Sen",
      "Kem Dưỡng Tay Hoa Cúc",
      "Kem Dưỡng Tay Xô Thơm",
      "Kem Dưỡng Tay Bưởi",
      "Kem Dưỡng Tay Nho",
      "Kem Dưỡng Tay Chanh Dây",
      "Kem Dưỡng Tay Hoa Anh Đào",
    ],
  },

  // ── 6. ROOM SPRAYS 🆕 ──────────────────────────────────
  {
    name: "Room Sprays",
    slug: "room-sprays",
    description:
      "Xịt phòng thơm tức thì, khử mùi, an toàn cho không gian sống.",
    basePrice: [180_000, 500_000],
    imageSource: "diffusers-refills", // dùng lại ảnh pool diffuser
    variants: [
      { size: "100ml", multiplier: 1.0 },
      { size: "250ml", multiplier: 2.0 },
    ],
    productNames: [
      "Xịt Phòng Trà Trắng",
      "Xịt Phòng Gỗ Đàn Hương",
      "Xịt Phòng Hoa Nhài",
      "Xịt Phòng Oải Hương",
      "Xịt Phòng Cam Bergamot",
      "Xịt Phòng Chanh Sả",
      "Xịt Phòng Bạc Hà",
      "Xịt Phòng Hoa Hồng",
      "Xịt Phòng Quế Ấm",
      "Xịt Phòng Vani",
      "Xịt Phòng Gỗ Thông",
      "Xịt Phòng Tuyết Tùng",
      "Xịt Phòng Hổ Phách",
      "Xịt Phòng Xạ Hương",
      "Xịt Phòng Hoa Ngọc Lan",
      "Xịt Phòng Hoa Bưởi",
      "Xịt Phòng Chanh Dây",
      "Xịt Phòng Cam Ngọt",
      "Xịt Phòng Quýt",
      "Xịt Phòng Bưởi",
      "Xịt Phòng Hoa Sen",
      "Xịt Phòng Hoa Cúc",
      "Xịt Phòng Đinh Hương",
      "Xịt Phòng Gừng",
      "Xịt Phòng Trầm Hương",
    ],
  },

  // ── 7. PERFUME OILS 🆕 ─────────────────────────────────
  {
    name: "Perfume Oils",
    slug: "perfume-oils",
    description: "Tinh dầu nước hoa nguyên chất, lưu hương lâu, không cồn.",
    basePrice: [400_000, 1_500_000],
    imageSource: "colognes", // dùng lại ảnh pool cologne
    variants: [
      { size: "10ml", multiplier: 1.0 },
      { size: "30ml", multiplier: 2.5 },
    ],
    productNames: [
      "Tinh Dầu Nước Hoa Đàn Hương",
      "Tinh Dầu Nước Hoa Hoa Hồng",
      "Tinh Dầu Nước Hoa Xạ Hương",
      "Tinh Dầu Nước Hoa Trầm Hương",
      "Tinh Dầu Nước Hoa Hổ Phách",
      "Tinh Dầu Nước Hoa Vani",
      "Tinh Dầu Nước Hoa Gỗ Tuyết Tùng",
      "Tinh Dầu Nước Hoa Hoa Nhài",
      "Tinh Dầu Nước Hoa Oải Hương",
      "Tinh Dầu Nước Hoa Cam Bergamot",
      "Tinh Dầu Nước Hoa Chanh Verbena",
      "Tinh Dầu Nước Hoa Cỏ Vetiver",
      "Tinh Dầu Nước Hoa Da Thuộc",
      "Tinh Dầu Nước Hoa Gỗ Sồi",
      "Tinh Dầu Nước Hoa Hoa Ngọc Lan",
      "Tinh Dầu Nước Hoa Gỗ Mun",
      "Tinh Dầu Nước Hoa Hoa Sen",
      "Tinh Dầu Nước Hoa Quế Ấm",
      "Tinh Dầu Nước Hoa Gừng Ấm",
      "Tinh Dầu Nước Hoa Hoa Mẫu Đơn",
      "Tinh Dầu Nước Hoa Gỗ Tre",
      "Tinh Dầu Nước Hoa Hoa Ly",
      "Tinh Dầu Nước Hoa Quả Sung",
      "Tinh Dầu Nước Hoa Hoa Bưởi",
      "Tinh Dầu Nước Hoa Gỗ Hồng Đào",
    ],
  },

  // ── 8. BATH SALTS 🆕 ───────────────────────────────────
  {
    name: "Bath Salts",
    slug: "bath-salts",
    description: "Muối tắm thư giãn, làm mềm da, giảm căng thẳng.",
    basePrice: [180_000, 600_000],
    imageSource: "candle", // dùng lại ảnh pool candle (hũ thủy tinh)
    variants: [
      { size: "250g", multiplier: 1.0 },
      { size: "500g", multiplier: 1.8 },
    ],
    productNames: [
      "Muối Tắm Oải Hương",
      "Muối Tắm Hoa Hồng",
      "Muối Tắm Muối Biển",
      "Muối Tắm Trà Xanh",
      "Muối Tắm Bạc Hà",
      "Muối Tắm Chanh Sả",
      "Muối Tắm Gừng",
      "Muối Tắm Quế",
      "Muối Tắm Vani",
      "Muối Tắm Mật Ong",
      "Muối Tắm Dừa",
      "Muối Tắm Đào Trắng",
      "Muối Tắm Cam Quýt",
      "Muối Tắm Hoa Nhài",
      "Muối Tắm Hoa Cúc",
      "Muối Tắm Hoa Sen",
      "Muối Tắm Hoa Anh Đào",
      "Muối Tắm Bưởi",
      "Muối Tắm Chanh Dây",
      "Muối Tắm Xô Thơm",
      "Muối Tắm Yến Mạch",
      "Muối Tắm Nha Đam",
      "Muối Tắm Hạnh Nhân",
      "Muối Tắm Tràm Trà",
      "Muối Tắm Gỗ Đàn Hương",
    ],
  },
];

const IMAGES_MAP: Record<string, string[]> = {
  colognes: COLOGNE_IMAGES,
  candle: CANDLE_IMAGES,
  "body-hand-wash": BODY_WASH_IMAGES,
  "diffusers-refills": DIFFUSER_IMAGES,
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const toSlug = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const roundVND = (value: number) => Math.round(value / 1_000) * 1_000;

const randRating = () => Math.round((4 + Math.random()) * 10) / 10;

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────
async function main() {
  console.log("🌱 Bắt đầu seed...\n");

  console.log("🧹 Xoá dữ liệu cũ...");
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.product.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  console.log("   ✔ Xong\n");

  let totalProducts = 0;
  let totalVariants = 0;
  let totalImages = 0;

  for (const cat of CATEGORIES) {
    const images = IMAGES_MAP[cat.imageSource];
    if (!images || images.length === 0) {
      console.warn(`⚠ Không có ảnh cho "${cat.imageSource}", bỏ qua\n`);
      continue;
    }

    console.log(
      `📦 ${cat.name} (${cat.productNames.length} SP × ${cat.variants.length} variants)`,
    );

    const category = await prisma.category.create({
      data: { name: cat.name, slug: cat.slug },
    });

    for (let i = 0; i < cat.productNames.length; i++) {
      const name = cat.productNames[i]!;
      const slug = toSlug(name);
      const basePrice = roundVND(randInt(cat.basePrice[0], cat.basePrice[1]));

      // 🎲 Random 1 → N variant (contiguous từ size nhỏ nhất)
      const variantCount = randInt(1, cat.variants.length);
      const selectedVariants = cat.variants.slice(0, variantCount);

      // 🖼️ Mỗi variant 1 ảnh riêng — cycle qua pool ảnh
      const perProductOffset = i * cat.variants.length;
      const variantsData = selectedVariants.map((v, vIndex) => ({
        sku: `${cat.slug.toUpperCase().replace(/-/g, "")}-${String(i + 1).padStart(3, "0")}-${v.size.toUpperCase()}`,
        size: v.size,
        color: "",
        price: roundVND(basePrice * v.multiplier),
        stock: randInt(5, 100),
        isActive: true,
        images: {
          create: {
            url: images[(perProductOffset + vIndex) % images.length]!,
            alt: `${name} — ${cat.name} ${v.size}`,
            isPrimary: true,
          },
        },
      }));

      await prisma.product.create({
        data: {
          name,
          slug,
          description: `${name} — ${cat.description}`,
          starRating: randRating(),
          reviewCount: randInt(0, 350),
          soldCount: randInt(0, 800),
          categories: { create: { categoryId: category.id } },
          variants: { create: variantsData },
        },
      });

      totalProducts++;
      totalVariants += variantsData.length;
      totalImages += variantsData.length;
    }

    console.log(`   ✔ Đã tạo ${cat.productNames.length} SP\n`);
  }

  const [categories, products, variants, images] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.productVariant.count(),
    prisma.productImage.count(),
  ]);

  console.log("✨ Seed hoàn tất!");
  console.log(`   Categories : ${categories}`);
  console.log(`   Products   : ${products}`);
  console.log(`   Variants   : ${variants}`);
  console.log(`   Images     : ${images}`);
  console.log(
    `   (tạo mới)  : ${totalProducts} SP / ${totalVariants} variants / ${totalImages} images`,
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed thất bại:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
