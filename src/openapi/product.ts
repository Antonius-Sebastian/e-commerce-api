import {
    createProductVariantSchema,
    productSchema,
    productVariantSchema,
} from '../schemas/product.schema'
import { registry } from './registry'
import { z } from 'zod'

registry.register('Product', productSchema)
registry.register('ProductVariant', productVariantSchema)

// GET /products
registry.registerPath({
    tags: ['Products'],
    method: 'get',
    path: '/products',
    summary: 'List all products',
    responses: {
        200: {
            description: 'Array of products',
            content: {
                'application/json': {
                    schema: z.array(productSchema),
                },
            },
        },
    },
})

// GET /products/{product_id}
registry.registerPath({
    tags: ['Products'],
    method: 'get',
    path: '/products/{product_id}',
    summary: 'Get single product by ID',
    request: {
        params: z.object({
            product_id: z.string().openapi({ example: '1' }),
        }),
    },
    responses: {
        200: {
            description: 'Product found',
            content: {
                'application/json': {
                    schema: productSchema,
                },
            },
        },
        404: { description: 'Product not found' },
    },
})

// POST /products
registry.registerPath({
    tags: ['Products'],
    method: 'post',
    path: '/products',
    summary: 'Create a product',
    description: 'Only admins can create a product',
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: productSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Product created',
            content: {
                'application/json': {
                    schema: productSchema,
                },
            },
        },
        403: { description: 'Forbidden - Admins only' },
    },
})

// PUT /products/{product_id}
registry.registerPath({
    tags: ['Products'],
    method: 'put',
    path: '/products/{product_id}',
    summary: 'Update product',
    request: {
        params: z.object({
            product_id: z.string().openapi({ example: '1' }),
        }),
        body: {
            content: {
                'application/json': {
                    schema: productSchema,
                },
            },
        },
    },
    security: [{ bearerAuth: [] }],
    responses: {
        200: {
            description: 'Product updated',
        },
        403: { description: 'Forbidden' },
    },
})

// DELETE /products/{product_id}
registry.registerPath({
    tags: ['Products'],
    method: 'delete',
    path: '/products/{product_id}',
    summary: 'Delete a product',
    request: {
        params: z.object({
            product_id: z.string().openapi({ example: '1' }),
        }),
    },
    security: [{ bearerAuth: [] }],
    responses: {
        204: { description: 'Deleted successfully' },
        403: { description: 'Forbidden' },
    },
})

// POST /products/{product_id}/variants
registry.registerPath({
    tags: ['Products'],
    method: 'post',
    path: '/products/{product_id}/variants',
    summary: 'Add product variant',
    request: {
        params: z.object({
            product_id: z.string().openapi({ example: '1' }),
        }),
        body: {
            content: {
                'application/json': {
                    schema: createProductVariantSchema,
                },
            },
        },
    },
    security: [{ bearerAuth: [] }],
    responses: {
        201: {
            description: 'Variant added',
        },
    },
})

// PUT /products/variants/{variant_id}
registry.registerPath({
    tags: ['Products'],
    method: 'put',
    path: '/products/variants/{variant_id}',
    summary: 'Update product variant',
    request: {
        params: z.object({
            variant_id: z.string().openapi({ example: '1' }),
        }),
        body: {
            content: {
                'application/json': {
                    schema: productVariantSchema,
                },
            },
        },
    },
    security: [{ bearerAuth: [] }],
    responses: {
        200: { description: 'Variant updated' },
    },
})

// DELETE /products/variants/{variant_id}
registry.registerPath({
    tags: ['Products'],
    method: 'delete',
    path: '/products/variants/{variant_id}',
    summary: 'Delete product variant',
    request: {
        params: z.object({
            variant_id: z.string().openapi({ example: '1' }),
        }),
    },
    security: [{ bearerAuth: [] }],
    responses: {
        204: { description: 'Deleted' },
    },
})
