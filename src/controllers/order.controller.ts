import { NextFunction, Request, Response } from 'express'
import prisma from '../prisma/client'
import { createError } from '../utils/createError'
import { ORDER_ERRORS, ORDER_ITEM_ERRORS, USER_ERRORS } from '../constants/error.constants'
import { CreateOrderInput, type UpdateOrderInput } from '../schemas/order.schema'
import { OrderStatus } from '@prisma/client'

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await prisma.order.findMany({
            include: { orderItems: true, user: true },
        })
        res.json({ status: 'success', data: { orders } })
    } catch (error) {
        next(error)
    }
}

export const getOrder = async (
    req: Request<{ order_id: string }, {}, {}>,
    res: Response,
    next: NextFunction
) => {
    const { order_id } = req.params
    try {
        const order = await prisma.order.findUnique({
            where: { order_id },
            include: { orderItems: true, user: true },
        })

        if (!order) {
            return next(createError(ORDER_ERRORS.NOT_FOUND))
        }

        res.json({ message: 'success', data: { order } })
    } catch (error) {
        next(error)
    }
}

export const getUserOrders = async (
    req: Request<{ user_id: string }, {}, {}>,
    res: Response,
    next: NextFunction
) => {
    const { user_id } = req.params

    try {
        const orders = await prisma.order.findMany({
            where: { user_id },
            include: { orderItems: true, user: true },
        })
        res.json({ status: 'success', data: { orders } })
    } catch (error) {
        next(error)
    }
}

export const addOrder = async (
    req: Request<{}, {}, CreateOrderInput>,
    res: Response,
    next: NextFunction
) => {
    const { orderItems, user_id } = req.body
    if (!user_id) {
        return next(createError(USER_ERRORS.NOT_FOUND))
    }

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
        return next(createError(ORDER_ITEM_ERRORS.NOT_FOUND))
    }

    try {
        const user = await prisma.user.findUnique({ where: { user_id } })

        if (!user) {
            next(createError(USER_ERRORS.NOT_FOUND))
        }

        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    user_id,
                    total_price: 0,
                    order_date: new Date(),
                },
            })

            const orderItemsData = []
            let calculatedTotalPrice = 0

            for (const item of orderItems) {
                const quantity = item.quantity

                const productVariant = await tx.productVariant.findUnique({
                    where: { variant_id: item.product_variant_id },
                })

                if (!productVariant) {
                    throw createError({
                        statusCode: 404,
                        message: `Product variant with ID ${item.product_variant_id} not found`,
                    })
                }

                // Step 4: Check stock availability
                if (productVariant.stock_quantity < quantity) {
                    throw createError({
                        statusCode: 400,
                        message: `Not enough stock for product variant ID ${item.product_variant_id}. Available: ${productVariant.stock_quantity}`,
                    })
                }

                // Calculate price
                const itemPrice = Number(productVariant.price) * quantity
                calculatedTotalPrice += itemPrice

                // Prepare order item data
                orderItemsData.push({
                    order_id: newOrder.order_id,
                    product_variant_id: item.product_variant_id,
                    quantity: quantity,
                    price: itemPrice,
                })

                // Update product stock
                await tx.productVariant.update({
                    where: { variant_id: item.product_variant_id },
                    data: { stock_quantity: productVariant.stock_quantity - quantity },
                })
            }

            // Create all order items
            await tx.orderItem.createMany({
                data: orderItemsData,
            })

            // Update order with total price
            return await tx.order.update({
                where: { order_id: newOrder.order_id },
                data: { total_price: calculatedTotalPrice },
                include: {
                    orderItems: {
                        include: {
                            productVariant: true,
                        },
                    },
                    user: true,
                },
            })
        })
        res.status(201).json({
            status: 'success',
            data: { order },
        })
    } catch (error) {
        next(error)
    }
}

export const updateOrderStatus = async (
    req: Request<{ order_id: string }, {}, UpdateOrderInput>,
    res: Response,
    next: NextFunction
) => {
    const { order_id } = req.params
    const { status } = req.body

    try {
        const existingOrder = await prisma.order.findUnique({ where: { order_id } })
        if (!existingOrder) {
            return next(createError(ORDER_ERRORS.NOT_FOUND))
        }

        const updatedOrder = await prisma.order.update({
            data: { status },
            where: { order_id },
            include: { orderItems: true, user: true },
        })

        res.json({ status: 'success', data: { order: updatedOrder } })
    } catch (error) {
        next(error)
    }
}

export const cancelOrder = async (
    req: Request<{ order_id: string }, {}, {}>,
    res: Response,
    next: NextFunction
) => {
    const { order_id } = req.params
    try {
        const existingOrder = await prisma.order.findUnique({
            where: { order_id },
            include: { orderItems: true },
        })

        if (!existingOrder) {
            return next(createError(ORDER_ERRORS.NOT_FOUND))
        }

        // Only allow cancellation if order is pending or processing
        if (existingOrder.status !== 'PENDING' && existingOrder.status !== 'PROCESSING') {
            return next(createError(ORDER_ERRORS.CANNOT_MODIFY))
        }

        // Start a transaction
        const cancelledOrder = await prisma.$transaction(async (tx) => {
            // Restore stock quantities
            for (const item of existingOrder.orderItems) {
                if (item.product_variant_id) {
                    const productVariant = await tx.productVariant.findUnique({
                        where: { variant_id: item.product_variant_id },
                    })

                    if (productVariant) {
                        await tx.productVariant.update({
                            where: { variant_id: item.product_variant_id },
                            data: {
                                stock_quantity: productVariant.stock_quantity + item.quantity,
                            },
                        })
                    }
                }
            }

            // Update order status to cancelled
            const updated = await tx.order.update({
                where: { order_id },
                data: { status: OrderStatus.CANCELLED },
                include: {
                    orderItems: {
                        include: {
                            productVariant: {
                                include: {
                                    product: true,
                                },
                            },
                        },
                    },
                    user: true,
                },
            })

            return updated
        })

        res.json({
            status: 'success',
            data: { order: cancelledOrder },
        })
    } catch (error) {
        next(error)
    }
}

export const deleteOrder = async (
    req: Request<{ order_id: string }, {}, {}>,
    res: Response,
    next: NextFunction
) => {
    const { order_id } = req.params
    try {
        // Check if order exists
        const existingOrder = await prisma.order.findUnique({
            where: { order_id },
        })

        if (!existingOrder) {
            return next(createError(ORDER_ERRORS.NOT_FOUND))
        }

        // Delete the order (this will cascade delete the order items)
        const deletedOrder = await prisma.order.delete({
            where: { order_id },
        })

        res.json({
            status: 'success',
            data: { order: deletedOrder },
        })
    } catch (error) {
        next(error)
    }
}
