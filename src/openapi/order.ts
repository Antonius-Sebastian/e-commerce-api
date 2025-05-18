import { registry } from './registry'
import { z } from 'zod'
import {
    createOrderSchema,
    orderItemSchema,
    orderSchema,
    updateOrderSchema,
} from '../schemas/order.schema'

registry.register('Order', orderSchema)
registry.register('CreateOrder', createOrderSchema)
registry.register('UpdateOrder', updateOrderSchema)
registry.register('OrderItem', orderItemSchema)

// GET /orders
registry.registerPath({
    tags: ['Orders'],
    method: 'get',
    path: '/orders',
    summary: 'Get all orders (admin only)',
    security: [{ bearerAuth: [] }],
    responses: {
        200: {
            description: 'List of orders',
            content: {
                'application/json': {
                    schema: z.array(orderSchema),
                },
            },
        },
    },
})

// GET /orders/{order_id}
registry.registerPath({
    tags: ['Orders'],
    method: 'get',
    path: '/orders/{order_id}',
    summary: 'Get order by ID',
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            order_id: z.string().openapi({ example: 'ord_789' }),
        }),
    },
    responses: {
        200: {
            description: 'Order details',
            content: {
                'application/json': {
                    schema: orderSchema,
                },
            },
        },
    },
})

// GET /orders/user/{user_id}
registry.registerPath({
    tags: ['Orders'],
    method: 'get',
    path: '/orders/user/{user_id}',
    summary: 'Get orders for a user (admin only)',
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            user_id: z.string().openapi({ example: 'user_456' }),
        }),
    },
    responses: {
        200: {
            description: 'User order list',
            content: {
                'application/json': {
                    schema: z.array(orderSchema),
                },
            },
        },
    },
})

// POST /orders
registry.registerPath({
    tags: ['Orders'],
    method: 'post',
    path: '/orders',
    summary: 'Create a new order',
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: z.object({
                        user_id: z
                            .string()
                            .min(1, 'User ID is required')
                            .openapi({ example: 'user_123' }),
                        orderItems: z.object({
                            product_variant_id: z
                                .number()
                                .int('Product variant ID must be a whole number')
                                .positive('Product variant ID must be positive')
                                .openapi({ example: 1 }),
                            quantity: z
                                .number()
                                .int('Quantity must be a whole number')
                                .positive('Quantity must be greater than 0')
                                .openapi({ example: 5 }),
                        }),
                    }),
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Order created',
            content: {
                'application/json': {
                    schema: orderSchema,
                },
            },
        },
    },
})

// PUT /orders/{order_id}
registry.registerPath({
    tags: ['Orders'],
    method: 'put',
    path: '/orders/{order_id}',
    summary: 'Update order status (admin only)',
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            order_id: z.string().openapi({ example: 'ord_789' }),
        }),
        body: {
            content: {
                'application/json': {
                    schema: updateOrderSchema,
                },
            },
        },
    },
    responses: {
        200: { description: 'Order status updated' },
    },
})

// PUT /orders/{order_id}/cancel
registry.registerPath({
    tags: ['Orders'],
    method: 'put',
    path: '/orders/{order_id}/cancel',
    summary: 'Cancel an order (user)',
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            order_id: z.string().openapi({ example: 'ord_789' }),
        }),
    },
    responses: {
        200: { description: 'Order cancelled' },
    },
})

// DELETE /orders/{order_id}
registry.registerPath({
    tags: ['Orders'],
    method: 'delete',
    path: '/orders/{order_id}',
    summary: 'Delete an order (admin only)',
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            order_id: z.string().openapi({ example: 'ord_789' }),
        }),
    },
    responses: {
        204: { description: 'Order deleted' },
    },
})
