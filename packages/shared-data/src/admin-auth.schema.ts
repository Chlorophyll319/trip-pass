import { z } from 'zod';

export const AdminLoginRequestSchema = z.object({
  email: z.email({ message: '請輸入有效的 Email' }),
  password: z.string().min(1, { message: '請輸入密碼' }),
});

export type AdminLoginRequest = z.infer<typeof AdminLoginRequestSchema>;
