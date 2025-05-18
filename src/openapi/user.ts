import { z } from 'zod'
import { userSchema } from '../schemas/auth.schema'
import { registry } from './registry'

registry.register('User', userSchema)

// GET /users
registry.registerPath({
    tags: ['Users'],
    method: 'get',
    path: '/users',
    summary: 'Get all users',
    security: [{ bearerAuth: [] }],
    responses: {
        200: {
            description: 'List of users',
            content: {
                'application/json': {
                    schema: z.array(userSchema),
                },
            },
        },
    },
})

// GET /users/search
registry.registerPath({
    tags: ['Users'],
    method: 'get',
    path: '/users/search',
    summary: 'Search users',
    security: [{ bearerAuth: [] }],
    request: {
        query: z.object({
            query: z.string().openapi({ example: 'john' }),
        }),
    },
    responses: {
        200: {
            description: 'Search results',
            content: {
                'application/json': {
                    schema: z.array(userSchema),
                },
            },
        },
    },
})

// GET /users/{user_id}
registry.registerPath({
    tags: ['Users'],
    method: 'get',
    path: '/users/{user_id}',
    summary: 'Get a user by ID',
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            user_id: z.string().openapi({ example: 'user_123' }),
        }),
    },
    responses: {
        200: {
            description: 'User found',
            content: {
                'application/json': {
                    schema: userSchema,
                },
            },
        },
    },
})

// POST /users
registry.registerPath({
    tags: ['Users'],
    method: 'post',
    path: '/users',
    summary: 'Create a new user',
    security: [{ bearerAuth: [] }],
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
            description: 'User created',
            content: {
                'application/json': {
                    schema: userSchema,
                },
            },
        },
    },
})

// PUT /users/{user_id}
registry.registerPath({
    tags: ['Users'],
    method: 'put',
    path: '/users/{user_id}',
    summary: 'Update user',
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            user_id: z.string().openapi({ example: 'user_123' }),
        }),
        body: {
            content: {
                'application/json': {
                    schema: userSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'User updated',
        },
    },
})

// DELETE /users/{user_id}
registry.registerPath({
    tags: ['Users'],
    method: 'delete',
    path: '/users/{user_id}',
    summary: 'Delete user',
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            user_id: z.string().openapi({ example: 'user_123' }),
        }),
    },
    responses: {
        204: {
            description: 'User deleted',
        },
    },
})
