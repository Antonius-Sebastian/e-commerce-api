import { Router } from 'express'
import {
    addOrder,
    cancelOrder,
    deleteOrder,
    getOrder,
    getOrders,
    getUserOrders,
    updateOrderStatus,
} from '../controllers/order.controller'
import { protect, restrictTo } from '../middlewares/auth.middleware'
import { Role } from '@prisma/client'
import { validateRequest } from '../middlewares/validation.middleware'
import { createOrderSchema, updateOrderSchema } from '../schemas/order.schema'

const orderRouter = Router()

orderRouter.get('/', protect, restrictTo(Role.ADMIN), getOrders)
orderRouter.get('/:order_id', protect, restrictTo(Role.ADMIN), getOrder)
orderRouter.get('/user/:user_id', protect, restrictTo(Role.ADMIN), getUserOrders)
orderRouter.post('/', protect, validateRequest(createOrderSchema), addOrder)
orderRouter.put(
    '/:order_id',
    protect,
    validateRequest(updateOrderSchema),
    restrictTo(Role.ADMIN),
    updateOrderStatus
)
orderRouter.put('/:order_id/cancel', protect, cancelOrder)
orderRouter.delete('/:order_id', protect, restrictTo(Role.ADMIN), deleteOrder)

export default orderRouter
