import { z } from 'zod'
import prisma from '../prisma/client'
import { OrderStatus } from '@prisma/client'

// Create a schema for order items
export const orderItemSchema = z.object({
    product_variant_id: z
        .number()
        .int('Product variant ID must be a whole number')
        .positive('Product variant ID must be positive'),
    quantity: z
        .number()
        .int('Quantity must be a whole number')
        .positive('Quantity must be greater than 0'),
    price: z.coerce
        .number()
        .positive('Price must be greater than 0')
        .transform((val) => Math.round(val * 100) / 100)
        .optional(), // Round to 2 decimal places
})

// Base order schema for creating a new order
export const createOrderSchema = z.object({
    user_id: z.string().min(1, 'User ID is required').openapi({ example: 'user_123' }),
    order_date: z.coerce
        .date()
        .optional()
        .default(() => new Date()),
    // .openapi({ example: new Date().toString(), default: new Date() }),
    status: z.nativeEnum(OrderStatus).optional().default(OrderStatus.PENDING),
    // .openapi({ example: OrderStatus.PENDING, default: OrderStatus.PENDING }),
    total_price: z.coerce
        .number()
        .nonnegative('Total price cannot be negative')
        .transform((val) => Math.round(val * 100) / 100)
        .optional(), // Round to 2 decimal places
    orderItems: z.array(orderItemSchema).min(1, 'Order must contain at least one item'),
})

// Complete order schema (includes order_id)
export const orderSchema = createOrderSchema.extend({
    order_id: z.string().min(1, 'Order ID is required'),
})

// Schema for updating an order
export const updateOrderSchema = z.object({
    status: z.nativeEnum(OrderStatus),
})

export type OrderItemInput = z.infer<typeof orderItemSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type Order = z.infer<typeof orderSchema>
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>
