import { z } from 'zod';

export const OrderStatusEnum = z.enum(['PENDING', 'PAID', 'ISSUING', 'ISSUED', 'FAILED', 'CANCELLED', 'REFUNDED']);

export const CreateOrderItemSchema = z.object({
  productId: z.number().int().positive({ message: '無效的商品 ID' }),
  quantity: z.number().int().positive().default(1),
});

export const CreateOrderRequestSchema = z.object({
  items: z.array(CreateOrderItemSchema).min(1, { message: '購物車不可為空' }),
  couponCode: z.string().max(20).optional(),
  contactEmail: z.string().email().optional(),
});

export const UpdateOrderStatusRequestSchema = z.object({
  status: OrderStatusEnum,
});

export type CreateOrderItem = z.infer<typeof CreateOrderItemSchema>;
export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;
export type UpdateOrderStatusRequest = z.infer<typeof UpdateOrderStatusRequestSchema>;
export type OrderStatus = z.infer<typeof OrderStatusEnum>;
