import { PaymentMethod, prisma } from '@nguyenthanhduyofficial/database';

// PRODUCT //
export async function createTestUser(overrides?: {
  name?: string;
  email?: string;
}) {
  const name = overrides?.name ?? 'User Name';
  const email = overrides?.email ?? createUnique('email');

  const user = await prisma.user.create({
    data: {
      name,
      email,
    },
  });
  return user;
}

export async function createTestProductLove(userId: string, productId: string) {
  const productLove = await prisma.productLove.create({
    data: {
      userId,
      productId,
    },
  });
  return productLove;
}

export async function createTestProduct(overrides?: {
  name?: string;
  slug?: string;
  imageUrl?: string;
  categoryName?: string;
  categorySlug?: string;
  tagName?: string;
  tagSlug?: string;

  variantIsActive?: boolean;
}) {
  const name = overrides?.name ?? 'Test Product';
  const slug = overrides?.slug ?? createUnique('product');
  const categoryName = overrides?.categoryName ?? 'Category Name';
  const categorySlug = overrides?.categorySlug ?? createUnique('category');
  const tagName = overrides?.tagName ?? createUnique('tag');
  const tagSlug = overrides?.tagSlug ?? createUnique('tag');

  const product = await prisma.product.create({
    data: {
      name,
      slug,
    },
  });

  await createTestVariants(product.id);

  if (categorySlug) {
    const category = await createTestCategory(categoryName, categorySlug);
    await prisma.product.update({
      where: { id: product.id },
      data: {
        categories: {
          create: [{ categoryId: category.id }],
        },
      },
    });
  }

  if (tagSlug) {
    const tag = await createTestTag(tagName, tagSlug);
    await prisma.product.update({
      where: { id: product.id },
      data: {
        tags: {
          create: [{ tagId: tag.id }],
        },
      },
    });
  }

  return product;
}

export async function createTestVariants(
  productId: string,
  price: number = 100,
  stock: number = 1,
  isActive: boolean = true,
  url: string = 'https://via.placeholder.com/300',
) {
  const variant = await prisma.productVariant.create({
    data: {
      price,
      stock,
      isActive,
      productId,
    },
  });

  await prisma.productImage.create({
    data: {
      variantId: variant.id,
      url,
    },
  });
  return variant;
}

export async function createTestCategory(
  categoryName: string,
  categorySlug: string,
) {
  const category = await prisma.category.create({
    data: {
      name: categoryName,
      slug: categorySlug,
    },
  });
  return category;
}

export async function createTestTag(tagName: string, tagSlug: string) {
  const tag = await prisma.tag.create({
    data: {
      name: tagName,
      slug: tagSlug,
    },
  });
  return tag;
}

// ORDER //
export async function createTestOrder(overrides?: {
  code?: string;
  subtotal?: number;
  shippingFee?: number;
  total?: number;
  paymentMethod?: PaymentMethod;
}) {
  const code = overrides?.code ?? createUnique('order');
  const subtotal = overrides?.subtotal ?? 0;
  const shippingFee = overrides?.shippingFee ?? 0;
  const total = overrides?.total ?? subtotal + shippingFee;
  const paymentMethod = overrides?.paymentMethod ?? PaymentMethod.cod;
  const order = await prisma.order.create({
    data: {
      code,
      subtotal,
      shippingFee,
      total,
      paymentMethod,
    },
  });
  return order;
}

export async function createTestOrderItem(
  orderId: string,
  productId: string,
  price: number,
  quantity: number,
  subtotal: number,
) {
  const orderItem = await prisma.orderItem.create({
    data: {
      orderId,
      productId,
      price,
      quantity,
      subtotal,
    },
  });
  return orderItem;
}

export async function createTestShipping(
  orderId: string = createUnique('order'),
  name: string = 'Shipping Name',
  phone: string = '1234567890',
  address: string = 'HCM',
  note?: string,
) {
  const shipping = await prisma.shipping.create({
    data: {
      orderId,
      name,
      phone,
      address,
      note,
    },
  });
  return shipping;
}

// HELPER //
export function createUnique(name?: string) {
  return `test-${name}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
