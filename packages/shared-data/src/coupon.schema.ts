import { z } from 'zod';

export const DiscountTypeEnum = z.enum(['ORDER_DISCOUNT', 'PRODUCT_DISCOUNT']);
export const DiscountValueTypeEnum = z.enum(['PERCENTAGE', 'FIXED']);
export const CouponStatusEnum = z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'EXPIRED']);
export const CouponDistributionTypeEnum = z.enum(['FIXED', 'RANDOM']);

const CouponFieldsSchema = z.object({
  name: z.string().min(1, { message: '請輸入優惠券名稱' }).max(100),
  description: z.string().max(500).optional(),
  distributionType: CouponDistributionTypeEnum,
  fixedCode: z
    .string()
    .min(1)
    .max(20)
    .transform((val) => val.trim().toUpperCase())
    .optional(),
  discountType: DiscountTypeEnum,
  discountValueType: DiscountValueTypeEnum,
  discountValue: z.number().positive({ message: '折扣值必須大於 0' }),
  maxUsagePerUser: z.number().int().positive().default(1),
  minOrderAmount: z.number().nonnegative().optional(),
  maxDiscountAmount: z.number().positive().optional(),
  totalQuantity: z.number().int().positive().optional(),
  campaignStartAt: z.coerce.date(),
  campaignEndAt: z.coerce.date(),
  applicableProductIds: z.array(z.number().int().positive()).default([]),
});

function refineCampaignWindow<T extends { campaignStartAt: Date; campaignEndAt: Date }>(data: T) {
  return data.campaignEndAt > data.campaignStartAt;
}

function refineFixedCode<T extends { distributionType: 'FIXED' | 'RANDOM'; fixedCode?: string }>(data: T) {
  return data.distributionType !== 'FIXED' || !!data.fixedCode;
}

// PRD §2.5.3：PERCENTAGE 值域 0 < value <= 100（下限已由 discountValue 的 .positive() 保證）
function refineDiscountValue<T extends { discountValueType?: 'PERCENTAGE' | 'FIXED'; discountValue?: number }>(
  data: T,
) {
  if (data.discountValueType === 'PERCENTAGE' && data.discountValue !== undefined) {
    return data.discountValue <= 100;
  }
  return true;
}

export const CreateCouponRequestSchema = CouponFieldsSchema.refine(refineCampaignWindow, {
  message: '活動結束時間必須晚於開始時間',
  path: ['campaignEndAt'],
})
  .refine(refineFixedCode, {
    message: 'FIXED 模式必須提供 fixedCode',
    path: ['fixedCode'],
  })
  .refine(refineDiscountValue, {
    message: '百分比折扣值不可超過 100',
    path: ['discountValue'],
  });

// Update 為 partial：campaignWindow/fixedCode 等跨欄位規則沿用 legacy 慣例不在此驗證（兩欄需同時出現才有意義）。
// discountValue 上限僅在 discountValueType 與 discountValue 同時送出時驗證；
// 單獨 patch discountValue 時的型別判斷（PERCENTAGE 或 FIXED）留給 service 層比對既有 coupon 記錄。
export const UpdateCouponRequestSchema = CouponFieldsSchema.partial().refine(refineDiscountValue, {
  message: '百分比折扣值不可超過 100',
  path: ['discountValue'],
});

export const ValidateCouponRequestSchema = z.object({
  code: z
    .string()
    .min(1, { message: '優惠碼不可為空' })
    .max(20)
    .transform((val) => val.trim().toUpperCase()),
  orderAmount: z.number().positive(),
  productIds: z.array(z.number().int().positive()).min(1),
});

export type CreateCouponRequest = z.infer<typeof CreateCouponRequestSchema>;
export type UpdateCouponRequest = z.infer<typeof UpdateCouponRequestSchema>;
export type ValidateCouponRequest = z.infer<typeof ValidateCouponRequestSchema>;
export type DiscountType = z.infer<typeof DiscountTypeEnum>;
export type DiscountValueType = z.infer<typeof DiscountValueTypeEnum>;
export type CouponStatus = z.infer<typeof CouponStatusEnum>;
export type CouponDistributionType = z.infer<typeof CouponDistributionTypeEnum>;
