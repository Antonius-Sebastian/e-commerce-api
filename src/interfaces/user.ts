import { Role } from '@prisma/client'

export interface JwtPayload {
    user_id: string
    role: Role
    iat?: number
    exp?: number
}

export interface User {
    name: string
    user_id: string
    email: string
    role: Role
}
