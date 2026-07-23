import { z } from 'zod';

export const AdminRoleEnum = z.enum(['SUPER_ADMIN', 'ADMIN', 'VIEWER']);

export const CreateAdminUserRequestSchema = z.object({
  email: z.email({ message: '請輸入有效的 Email' }),
  password: z.string().min(8, { message: '密碼至少需要 8 個字元' }),
  name: z.string().min(1, { message: '請輸入姓名' }).max(50),
  role: AdminRoleEnum,
});

export const UpdateAdminUserRequestSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  role: AdminRoleEnum.optional(),
  isActive: z.boolean().optional(),
});

export type CreateAdminUserRequest = z.infer<typeof CreateAdminUserRequestSchema>;
export type UpdateAdminUserRequest = z.infer<typeof UpdateAdminUserRequestSchema>;
export type AdminRole = z.infer<typeof AdminRoleEnum>;
