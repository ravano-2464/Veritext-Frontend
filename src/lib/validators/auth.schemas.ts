import { z } from 'zod';

const emailSchema = z.string().email('Enter a valid email.');
const passwordSchema = z
  .string()
  .min(10, 'Password must be at least 10 characters.')
  .max(120, 'Password must be at most 120 characters.');

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = loginSchema.extend({
  fullName: z.string().min(2, 'Full name is required.').max(120),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const findAccountSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type FindAccountValues = z.infer<typeof findAccountSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
