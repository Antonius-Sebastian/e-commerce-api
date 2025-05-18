import { Router } from 'express'
import {
    addCategory,
    deleteCategory,
    getCategories,
    getCategory,
    updateCategory,
} from '../controllers/category.controller'
import { validateRequest } from '../middlewares/validation.middleware'
import { categorySchema } from '../schemas/product.schema'
import { protect, restrictTo } from '../middlewares/auth.middleware'
import { Role } from '@prisma/client'

const categoryRouter = Router()

categoryRouter.get('/', getCategories)
categoryRouter.get('/:category_id', protect, restrictTo(Role.ADMIN), getCategory)
categoryRouter.post(
    '/',
    protect,
    restrictTo(Role.ADMIN),
    validateRequest(categorySchema),
    addCategory
)
categoryRouter.put(
    '/:category_id',
    protect,
    restrictTo(Role.ADMIN),
    validateRequest(categorySchema),
    updateCategory
)
categoryRouter.delete('/:category_id', protect, restrictTo(Role.ADMIN), deleteCategory)

export default categoryRouter
