import { z } from 'zod';

// Phone number validation - international format
export const phoneSchema = z.string()
  .trim()
  .min(1, 'Phone number is required')
  .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number (e.g., +1234567890)')
  .max(20, 'Phone number is too long');

// Sign up form validation
export const signUpSchema = z.object({
  email: z.string()
    .trim()
    .email('Invalid email address')
    .max(255, 'Email is too long'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long'),
  confirmPassword: z.string(),
  name: z.string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name is too long'),
  phoneNumber: phoneSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Sign in form validation
export const signInSchema = z.object({
  email: z.string()
    .trim()
    .email('Invalid email address')
    .max(255, 'Email is too long'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
});

// Order data validation schema
export const orderDataSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string(),
    title: z.string().max(255),
    quantity: z.number().positive().int(),
    price: z.number().positive(),
    options: z.array(z.object({
      name: z.string(),
      value: z.string()
    })).optional()
  })).min(1, 'Order must contain at least one item'),
  total: z.number().positive(),
  currency: z.string().length(3),
});