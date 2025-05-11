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
    address: z.string().min(5, 'Address must be at least 5 characters'),
    phone_number: z.string().min(10, 'Phone number must be at least 10 digits'),
    role: z.enum([Role.ADMIN, Role.USER]).optional(),
})

export type UserInput = z.infer<typeof userSchema>
export type SignInInput = z.infer<typeof signInSchema>
