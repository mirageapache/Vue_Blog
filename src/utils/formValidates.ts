import { z } from 'zod';

export type ValidationSchemaKeys = 'email' | 'password' | 'confirmPassword' | 'account' | 'name';

export const validationSchema: Record<ValidationSchemaKeys, z.ZodString> = {
  email: z.string().email('Email格式錯誤'),
  password: z.string().min(8, '密碼長度至少8個字元').max(20, '密碼長度最多20個字元'),
  confirmPassword: z.string().min(8, '確認密碼長度至少8個字元').max(20, '確認密碼長度最多20個字元'),
  account: z.string().min(1, '帳號必填'),
  name: z.string().min(1, '名稱必填')
};