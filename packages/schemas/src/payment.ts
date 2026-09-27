import { z } from 'zod';

export const paymentMethodSchema = z.enum([
  'credit_card',
  'debit_card',
  'bank_transfer',
  'cod',
  'e_wallet',
]);
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export const paymentStatusSchema = z.enum([
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded',
]);
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;

export const paymentSchema = z.object({
  id: z.uuid(),
  orderId: z.uuid(),
  method: paymentMethodSchema,
  status: paymentStatusSchema,
  amount: z.number().positive(),
  transactionId: z.string().nullable(),
  paidAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export type Payment = z.infer<typeof paymentSchema>;

export const createPaymentInputSchema = z.object({
  orderId: z.uuid(),
  method: paymentMethodSchema,
  amount: z.number().positive(),
});
export type CreatePaymentInput = z.infer<typeof createPaymentInputSchema>;
