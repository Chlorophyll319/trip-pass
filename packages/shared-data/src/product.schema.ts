import { z } from 'zod';

export const PassTypeEnum = z.enum(['SINGLE_USE', 'MULTI_DAY']);

export const ProductCategorySchema = z.object({
  name: z.string().min(1, { message: '請輸入分類名稱' }).max(50),
  description: z.string().max(255).optional(),
  sort: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

const ProductFieldsSchema = z.object({
  categoryId: z.number().int().positive().optional(),
  name: z.string().min(1, { message: '請輸入商品名稱' }).max(100),
  description: z.string().max(1000).optional(),
  price: z.number().positive({ message: '售價必須大於 0' }),
  currency: z.string().default('TWD'),
  countryCode: z.string().length(2).optional(),
  type: PassTypeEnum,
  duration: z.number().int().positive({ message: '效期天數必須大於 0' }),
  partner: z.string().max(100).optional(),
  originalPrice: z.number().positive().optional(),
  instructions: z.string().max(2000).optional(),
  sort: z.number().int().optional(),
  isActive: z.boolean().default(true),
});

function refineOriginalPrice<T extends { price?: number; originalPrice?: number }>(data: T) {
  return !data.originalPrice || !data.price || data.originalPrice >= data.price;
}

export const CreateProductRequestSchema = ProductFieldsSchema.refine(refineOriginalPrice, {
  message: '原價不可低於售價',
  path: ['originalPrice'],
});

export const UpdateProductRequestSchema = ProductFieldsSchema.partial().refine(refineOriginalPrice, {
  message: '原價不可低於售價',
  path: ['originalPrice'],
});

export type ProductCategoryInput = z.infer<typeof ProductCategorySchema>;
export type CreateProductRequest = z.infer<typeof CreateProductRequestSchema>;
export type UpdateProductRequest = z.infer<typeof UpdateProductRequestSchema>;
export type PassType = z.infer<typeof PassTypeEnum>;
