import { z } from 'zod';

export const RegisterRequestSchema = z.object({
  email: z.email({ message: '請輸入有效的 Email' }),
  password: z.string().min(8, { message: '密碼至少需要 8 個字元' }),
  name: z.string().min(1, { message: '請輸入姓名' }).optional(),
});

export const LoginRequestSchema = z.object({
  email: z.email({ message: '請輸入有效的 Email' }),
  password: z.string().min(1, { message: '請輸入密碼' }),
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
