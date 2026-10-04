import 'dotenv/config';
import { prisma } from './prisma.js';

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ═══════════════════════════════════════════
// DATA DEFINITIONS
// ═══════════════════════════════════════════

const CATEGORIES = [
  { name: 'Nến', slug: 'nen' },
  { name: 'Nước hoa', slug: 'nuoc-hoa' },
  { name: 'Sữa tắm', slug: 'sua-tam' },
  { name: 'Tinh dầu', slug: 'tinh-dau' },
] as const;

const TAGS = [
  { name: 'Mới', slug: 'new' },
  { name: 'Bán chạy', slug: 'bestseller' },
  { name: 'Cao cấp', slug: 'premium' },
  { name: 'Thiên nhiên', slug: 'natural' },
  { name: 'Quà tặng', slug: 'gift' },
  { name: 'Giới hạn', slug: 'limited' },
] as const;

// Mỗi category có template sản phẩm riêng
const PRODUCTS_BY_CATEGORY: Record<
  string,
  Array<{
    name: string;
    description: string;
    basePrice: number;
    variants: Array<{
      size?: string;
      color?: string;
      priceMultiplier: number;
    }>;
  }>
> = {
  nen: [
    {
      name: 'Nến Thơm Lavender',
      description:
        'Nến thơm từ sáp đậu nành, hương lavender Pháp, cháy 40 giờ.',
      basePrice: 180_000,
      variants: [
        { size: 'S', priceMultiplier: 1 },
        { size: 'M', priceMultiplier: 1.4 },
        { size: 'L', priceMultiplier: 1.8 },
      ],
    },
    {
      name: 'Nến Thơm Vanilla',
      description:
        'Hương vanilla Madagascar ấm áp, phù hợp không gian phòng ngủ.',
      basePrice: 200_000,
      variants: [
        { size: 'S', priceMultiplier: 1 },
        { size: 'M', priceMultiplier: 1.4 },
        { size: 'L', priceMultiplier: 1.8 },
      ],
    },
    {
      name: 'Nến Thơm Sandalwood',
      description: 'Gỗ đàn hương Ấn Độ, mùi trầm ấm sang trọng.',
      basePrice: 250_000,
      variants: [
        { size: 'S', priceMultiplier: 1 },
        { size: 'M', priceMultiplier: 1.4 },
      ],
    },
    {
      name: 'Nến Thơm Jasmine',
      description: 'Hoa nhài trắng, nhẹ nhàng thư giãn.',
      basePrice: 190_000,
      variants: [
        { size: 'S', priceMultiplier: 1 },
        { size: 'M', priceMultiplier: 1.4 },
        { size: 'L', priceMultiplier: 1.8 },
      ],
    },
    {
      name: 'Nến Thơm Citrus',
      description: 'Cam chanh tươi mát, đánh thức tinh thần.',
      basePrice: 170_000,
      variants: [
        { size: 'S', priceMultiplier: 1 },
        { size: 'M', priceMultiplier: 1.4 },
      ],
    },
    {
      name: 'Nến Thơm Rose',
      description: 'Hoa hồng Bulgaria, lãng mạn và nữ tính.',
      basePrice: 220_000,
      variants: [
        { size: 'S', priceMultiplier: 1 },
        { size: 'M', priceMultiplier: 1.4 },
        { size: 'L', priceMultiplier: 1.8 },
      ],
    },
    {
      name: 'Nến Thơm Ocean',
      description: 'Hương biển mặn mòi, tươi mới.',
      basePrice: 185_000,
      variants: [
        { size: 'S', priceMultiplier: 1 },
        { size: 'M', priceMultiplier: 1.4 },
      ],
    },
  ],

  'nuoc-hoa': [
    {
      name: 'Nước Hoa Nữ Rose Garden',
      description: 'Hương hoa hồng, mẫu đơn, kéo dài 8 giờ.',
      basePrice: 850_000,
      variants: [
        { size: '30ml', priceMultiplier: 1 },
        { size: '50ml', priceMultiplier: 1.5 },
        { size: '100ml', priceMultiplier: 2.3 },
      ],
    },
    {
      name: 'Nước Hoa Nam Blue Ocean',
      description: 'Hương biển, gỗ tuyết tùng, nam tính mạnh mẽ.',
      basePrice: 920_000,
      variants: [
        { size: '50ml', priceMultiplier: 1 },
        { size: '100ml', priceMultiplier: 1.7 },
      ],
    },
    {
      name: 'Nước Hoa Unisex Amber',
      description: 'Hổ phách ấm áp, phù hợp cả nam và nữ.',
      basePrice: 1_100_000,
      variants: [
        { size: '50ml', priceMultiplier: 1 },
        { size: '100ml', priceMultiplier: 1.7 },
      ],
    },
    {
      name: 'Nước Hoa Nữ Cherry Blossom',
      description: 'Hoa anh đào Nhật Bản, ngọt ngào.',
      basePrice: 780_000,
      variants: [
        { size: '30ml', priceMultiplier: 1 },
        { size: '50ml', priceMultiplier: 1.5 },
      ],
    },
    {
      name: 'Nước Hoa Nam Leather',
      description: 'Da thuộc, gỗ đàn hương, lịch lãm.',
      basePrice: 1_250_000,
      variants: [
        { size: '50ml', priceMultiplier: 1 },
        { size: '100ml', priceMultiplier: 1.7 },
      ],
    },
    {
      name: 'Nước Hoa Nữ White Musk',
      description: 'Xạ hương trắng, tinh tế và quyến rũ.',
      basePrice: 890_000,
      variants: [
        { size: '30ml', priceMultiplier: 1 },
        { size: '50ml', priceMultiplier: 1.5 },
        { size: '100ml', priceMultiplier: 2.3 },
      ],
    },
    {
      name: 'Nước Hoa Nam Citrus Fresh',
      description: 'Cam bergamot, bạc hà, sảng khoái.',
      basePrice: 720_000,
      variants: [
        { size: '50ml', priceMultiplier: 1 },
        { size: '100ml', priceMultiplier: 1.7 },
      ],
    },
    {
      name: 'Nước Hoa Unisex Vanilla Musk',
      description: 'Vanilla kết hợp xạ hương, ấm áp gợi cảm.',
      basePrice: 980_000,
      variants: [
        { size: '50ml', priceMultiplier: 1 },
        { size: '100ml', priceMultiplier: 1.7 },
      ],
    },
  ],

  'sua-tam': [
    {
      name: 'Sữa Tắm Lavender Relax',
      description: 'Sữa tắm lavender giúp thư giãn, dưỡng ẩm da.',
      basePrice: 120_000,
      variants: [
        { size: '250ml', priceMultiplier: 1 },
        { size: '500ml', priceMultiplier: 1.7 },
      ],
    },
    {
      name: 'Sữa Tắm Trà Xanh',
      description: 'Trà xanh Thái Nguyên, kháng khuẩn, mát lạnh.',
      basePrice: 110_000,
      variants: [
        { size: '250ml', priceMultiplier: 1 },
        { size: '500ml', priceMultiplier: 1.7 },
      ],
    },
    {
      name: 'Sữa Tắm Dừa Bến Tre',
      description: 'Dầu dừa nguyên chất, dưỡng ẩm sâu.',
      basePrice: 130_000,
      variants: [
        { size: '250ml', priceMultiplier: 1 },
        { size: '500ml', priceMultiplier: 1.7 },
      ],
    },
    {
      name: 'Sữa Tắm Hoa Hồng',
      description: 'Chiết xuất hoa hồng, làm mềm da.',
      basePrice: 140_000,
      variants: [
        { size: '250ml', priceMultiplier: 1 },
        { size: '500ml', priceMultiplier: 1.7 },
      ],
    },
    {
      name: 'Sữa Tắm Sả Chanh',
      description: 'Sả chanh tự nhiên, đuổi muỗi, sảng khoái.',
      basePrice: 100_000,
      variants: [
        { size: '250ml', priceMultiplier: 1 },
        { size: '500ml', priceMultiplier: 1.7 },
      ],
    },
    {
      name: 'Sữa Tắm Yến Mạch',
      description: 'Yến mạch Colloidal, phù hợp da nhạy cảm.',
      basePrice: 150_000,
      variants: [
        { size: '250ml', priceMultiplier: 1 },
        { size: '500ml', priceMultiplier: 1.7 },
      ],
    },
    {
      name: 'Sữa Tắm Bơ Cacao',
      description: 'Bơ cacao nguyên chất, thơm ngọt, dưỡng ẩm.',
      basePrice: 145_000,
      variants: [
        { size: '250ml', priceMultiplier: 1 },
        { size: '500ml', priceMultiplier: 1.7 },
      ],
    },
  ],

  'tinh-dau': [
    {
      name: 'Tinh Dầu Bạc Hà',
      description: 'Tinh dầu bạc hà nguyên chất, làm sảng khoái tinh thần.',
      basePrice: 150_000,
      variants: [
        { size: '10ml', priceMultiplier: 1 },
        { size: '30ml', priceMultiplier: 2.2 },
      ],
    },
    {
      name: 'Tinh Dầu Tràm',
      description: 'Tinh dầu tràm gió, phòng cảm, tốt cho hô hấp.',
      basePrice: 130_000,
      variants: [
        { size: '10ml', priceMultiplier: 1 },
        { size: '30ml', priceMultiplier: 2.2 },
      ],
    },
    {
      name: 'Tinh Dầu Sả Chanh',
      description: 'Tinh dầu sả chanh, đuổi côn trùng, thư giãn.',
      basePrice: 120_000,
      variants: [
        { size: '10ml', priceMultiplier: 1 },
        { size: '30ml', priceMultiplier: 2.2 },
      ],
    },
    {
      name: 'Tinh Dầu Oải Hương',
      description: 'Tinh dầu oải hương Pháp, hỗ trợ giấc ngủ.',
      basePrice: 200_000,
      variants: [
        { size: '10ml', priceMultiplier: 1 },
        { size: '30ml', priceMultiplier: 2.2 },
      ],
    },
    {
      name: 'Tinh Dầu Quế',
      description: 'Tinh dầu quế ấm áp, kháng khuẩn.',
      basePrice: 140_000,
      variants: [
        { size: '10ml', priceMultiplier: 1 },
        { size: '30ml', priceMultiplier: 2.2 },
      ],
    },
    {
      name: 'Tinh Dầu Khuynh Diệp',
      description: 'Tinh dầu khuynh diệp, làm sạch không khí.',
      basePrice: 135_000,
      variants: [
        { size: '10ml', priceMultiplier: 1 },
        { size: '30ml', priceMultiplier: 2.2 },
      ],
    },
    {
      name: 'Tinh Dầu Gừng',
      description: 'Tinh dầu gừng, làm ấm cơ thể, massage.',
      basePrice: 145_000,
      variants: [
        { size: '10ml', priceMultiplier: 1 },
        { size: '30ml', priceMultiplier: 2.2 },
      ],
    },
    {
      name: 'Tinh Dầu Hương Thảo',
      description: 'Tinh dầu hương thảo, tập trung, tỉnh táo.',
      basePrice: 160_000,
      variants: [
        { size: '10ml', priceMultiplier: 1 },
        { size: '30ml', priceMultiplier: 2.2 },
      ],
    },
  ],
};

// Unsplash image IDs theo category
const IMAGE_POOL: Record<string, string[]> = {
  nen: [
    'photo-1608571423902-eed4a5ad8108',
    'photo-1601049676869-702ea24cfd58',
    'photo-1513506003901-1e6a229e2d15',
    'photo-1574269909862-7e1d70bb8078',
    'photo-1512413914633-b5043f4041ea',
  ],
  'nuoc-hoa': [
    'photo-1541643600914-78b084683601',
    'photo-1592945403244-b3fbafd7f539',
    'photo-1587017539504-67cfbddac569',
    'photo-1615634260167-c8cdede054de',
    'photo-1594035910387-fea47794261f',
  ],
  'sua-tam': [
    'photo-1556228720-195a672e8a03',
    'photo-1556228453-efd6c1ff04f6',
    'photo-1571781926291-c477ebfd024b',
    'photo-1585232004423-244e0e6904e3',
    'photo-1600857062241-98e5dba7f214',
  ],
  'tinh-dau': [
    'photo-1608571423902-eed4a5ad8108',
    'photo-1601049676869-702ea24cfd58',
    'photo-1513506003901-1e6a229e2d15',
    'photo-1556228453-efd6c1ff04f6',
    'photo-1574269909862-7e1d70bb8078',
  ],
};

function buildImageUrl(photoId: string, w = 800): string {
  return `https://images.unsplash.com/${photoId}?w=${w}&q=80&auto=format&fit=crop`;
}

function pickTagsForProduct(categorySlug: string): string[] {
  const pool = TAGS.map((t) => t.slug);
  const count = randomBetween(1, 3);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ═══════════════════════════════════════════
// SEED
// ═══════════════════════════════════════════

async function main() {
  console.log('🌱 Bắt đầu seed...');

  // ─── 1. Cleanup ───
  console.log('🧹 Xoá dữ liệu cũ...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productLove.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();

  // ─── 2. Categories ───
  console.log('📁 Tạo categories...');
  const categories = await Promise.all(
    CATEGORIES.map((c) =>
      prisma.category.create({
        data: { name: c.name, slug: c.slug },
      }),
    ),
  );
  const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));

  // ─── 3. Tags ───
  console.log('🏷️  Tạo tags...');
  const tags = await Promise.all(
    TAGS.map((t) =>
      prisma.tag.create({ data: { name: t.name, slug: t.slug } }),
    ),
  );
  const tagMap = new Map(tags.map((t) => [t.slug, t.id]));

  // ─── 4. Products ───
  console.log('📦 Tạo sản phẩm...');
  let productCount = 0;

  for (const [categorySlug, templates] of Object.entries(
    PRODUCTS_BY_CATEGORY,
  )) {
    const categoryId = categoryMap.get(categorySlug)!;
    const imagePool = IMAGE_POOL[categorySlug];

    for (const template of templates) {
      const slug = slugify(template.name);
      const tagsForProduct = pickTagsForProduct(categorySlug);

      // Tạo product
      const product = await prisma.product.create({
        data: {
          name: template.name,
          slug,
          description: template.description,
          starRating: randomBetween(30, 50) / 10, // 3.0 - 5.0
          reviewCount: randomBetween(10, 500),

          // Gán category
          categories: {
            create: [{ categoryId }],
          },

          // Gán tags
          tags: {
            create: tagsForProduct.map((tagSlug) => ({
              tagId: tagMap.get(tagSlug)!,
            })),
          },
        },
      });

      // Tạo variants + images
      for (let i = 0; i < template.variants.length; i++) {
        const v = template.variants[i];
        const price = Math.round(template.basePrice * v.priceMultiplier);

        const variant = await prisma.productVariant.create({
          data: {
            productId: product.id,
            size: v.size ?? null,
            color: v.color ?? null,
            price,
            stock: randomBetween(5, 100),
            isActive: true,
          },
        });

        // Tạo 2-3 ảnh cho variant
        const numImages = randomBetween(2, 3);
        for (let j = 0; j < numImages; j++) {
          const photoId = imagePool[(i + j) % imagePool.length];
          await prisma.productImage.create({
            data: {
              variantId: variant.id,
              url: buildImageUrl(photoId),
              alt: `${template.name} - ${v.size ?? ''} ${v.color ?? ''}`.trim(),
              isPrimary: j === 0,
            },
          });
        }
      }

      productCount++;
      console.log(`  ✓ [${categorySlug}] ${template.name}`);
    }
  }

  console.log('');
  console.log('═══════════════════════════════════════');
  console.log(`✅ Seed thành công!`);
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${tags.length} tags`);
  console.log(`   - ${productCount} products`);
  console.log('═══════════════════════════════════════');
}

main()
  .catch((err) => {
    console.error('❌ Seed lỗi:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
