import { Role } from '@prisma/client'
import { z } from 'zod'

export const signInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
})

export const userSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
    // TODO: add more validation
    address: z
        .string()
        .min(5, 'Address must be at least 5 characters')
        .max(100, 'Address must not exceed 100 characters'),
    phone_number: z.string().regex(/^\d{10,15}$/, 'Phone number must be 10 to 15 digits'),
    role: z.nativeEnum(Role).optional(),
})

export type UserInput = z.infer<typeof userSchema>
export type SignInInput = z.infer<typeof signInSchema>
