import { z } from 'zod'
import { categorySchema } from '../schemas/product.schema'
import { registry } from './registry'

registry.register('Category', categorySchema)

// GET /categories
registry.registerPath({
    tags: ['Categories'],
    method: 'get',
    path: '/categories',
    summary: 'List all categories',
    responses: {
        200: {
            description: 'Array of categories',
            content: {
                'application/json': {
                    schema: z.array(categorySchema),
                },
            },
        },
    },
})

// GET /categories/{category_id}
registry.registerPath({
    tags: ['Categories'],
    method: 'get',
    path: '/categories/{category_id}',
    summary: 'Get a category by ID',
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            category_id: z.string().openapi({ example: '1' }),
        }),
    },
    responses: {
        200: {
            description: 'Category found',
            content: {
                'application/json': {
                    schema: categorySchema,
                },
            },
        },
        404: { description: 'Category not found' },
    },
})

// POST /categories
registry.registerPath({
    tags: ['Categories'],
    method: 'post',
    path: '/categories',
    summary: 'Create a new category',
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: categorySchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Category created',
            content: {
                'application/json': {
                    schema: categorySchema,
                },
            },
        },
    },
})

// PUT /categories/{category_id}
registry.registerPath({
    tags: ['Categories'],
    method: 'put',
    path: '/categories/{category_id}',
    summary: 'Update a category',
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            category_id: z.string().openapi({ example: '1' }),
        }),
        body: {
            content: {
                'application/json': {
                    schema: categorySchema,
                },
            },
        },
    },
    responses: {
        200: { description: 'Category updated' },
    },
})

// DELETE /categories/{category_id}
registry.registerPath({
    tags: ['Categories'],
    method: 'delete',
    path: '/categories/{category_id}',
    summary: 'Delete a category',
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            category_id: z.string().openapi({ example: '1' }),
        }),
    },
    responses: {
        204: { description: 'Category deleted' },
    },
})
