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
}) {
  const name = overrides?.name ?? 'Test Product';
  const slug = overrides?.slug ?? createUnique('product');

  const product = await prisma.product.create({
    data: {
      name,
      slug,
    },
  });

  return product;
}

export async function createTestVariant(
  productId: string,
  price: number = 100,
  stock: number = 1,
  isActive: boolean = true,
) {
  const variant = await prisma.productVariant.create({
    data: {
      price,
      stock,
      isActive,
      productId,
    },
  });

  return variant;
}

export async function createTestImage(
  variantId: string,
  url: string = 'https://via.placeholder.com/300',
) {
  const image = await prisma.productImage.create({
    data: {
      variantId: variantId,
      url,
    },
  });
  return image;
}

export async function createTestCategory(
  categorySlug: string,
  productId: string,
  categoryName: string = 'Category Name',
) {
  const category = await prisma.category.create({
    data: {
      products: { create: [{ productId }] },
      name: categoryName,
      slug: categorySlug,
    },
  });
  return category;
}

export async function createTestTag(
  tagSlug: string,
  productId: string,
  tagName: string = 'Tag Name',
) {
  const tag = await prisma.tag.create({
    data: {
      name: tagName,
      slug: tagSlug,
      products: { create: [{ productId }] },
    },
  });
  return tag;
}

// ORDER //
export async function createTestOrder(
  userId: string,
  overrides?: {
    code?: string;
    subtotal?: number;
    shippingFee?: number;
    total?: number;
    paymentMethod?: PaymentMethod;
  },
) {
  const code = overrides?.code ?? createUnique('order');
  const subtotal = overrides?.subtotal ?? 0;
  const shippingFee = overrides?.shippingFee ?? 0;
  const total = overrides?.total ?? subtotal + shippingFee;
  const paymentMethod = overrides?.paymentMethod ?? PaymentMethod.cod;
  const order = await prisma.order.create({
    data: {
      userId,
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
  variantId: string,
  orderId: string,
  productId: string,
  price: number,
  quantity: number,
  subtotal: number,
  name: string,
  imageUrl: string,
) {
  const orderItem = await prisma.orderItem.create({
    data: {
      orderId,
      productId,
      price,
      quantity,
      subtotal,
      variantId,
      name,
      imageUrl,
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
