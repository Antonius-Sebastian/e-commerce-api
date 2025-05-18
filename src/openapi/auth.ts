import { registry } from './registry'
import { signInSchema, userSchema } from '../schemas/auth.schema'
import { z } from 'zod'

// SIGN-UP
registry.register('UserSignUp', userSchema)
registry.registerPath({
    tags: ['Auth'],
    method: 'post',
    path: '/auth/sign-up',
    description: 'Register a new user',
    summary: 'Sign up',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: userSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'User created successfully',
        },
        400: {
            description: 'Validation error',
        },
        409: {
            description: 'Email already exists',
        },
    },
})

// SIGN-IN
registry.register('UserSignIn', signInSchema)
registry.registerPath({
    tags: ['Auth'],
    method: 'post',
    path: '/auth/sign-in',
    description: 'Authenticate user and return token',
    summary: 'Sign in',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: signInSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Login successful, returns access token',
            content: {
                'application/json': {
                    schema: z.object({
                        accessToken: z.string().openapi({ example: 'your.jwt.token.here' }),
                    }),
                },
            },
        },
        401: {
            description: 'Unauthorized - invalid credentials',
        },
    },
})
