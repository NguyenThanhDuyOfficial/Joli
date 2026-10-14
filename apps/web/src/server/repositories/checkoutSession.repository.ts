import { Prisma, prisma } from "@nguyenthanhduyofficial/database";

export const CreateCheckoutSessionSelect = {
  id: true,
} satisfies Prisma.CheckoutSessionSelect;

export const CheckoutSessionSelect = {
  id: true,
  subTotal: true,
  total: true,
  items: {
    select: {
      id: true,
      name: true,
      image: true,
      price: true,
      quantity: true,
      subTotal: true,
    },
  },
} satisfies Prisma.CheckoutSessionSelect;

export class CheckoutSessionRepository {
  async findById(id: string) {
    return prisma.checkoutSession.findUnique({
      where: { id },
      select: CheckoutSessionSelect,
    });
  }
  async create(data: Prisma.CheckoutSessionUncheckedCreateInput) {
    return prisma.checkoutSession.create({
      data,
      select: CreateCheckoutSessionSelect,
    });
  }
}
