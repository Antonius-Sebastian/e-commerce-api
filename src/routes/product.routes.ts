import { Router } from 'express'
import {
    addProduct,
    deleteProduct,
    getProducts,
    getProduct,
    updateProduct,
    addProductVariant,
    updateProductVariant,
    deleteProductVariant,
} from '../controllers/product.controller'
import { protect, restrictTo } from '../middlewares/auth.middleware'
import { Role } from '@prisma/client'
import { validateRequest } from '../middlewares/validation.middleware'
import {
    createProductVariantSchema,
    productSchema,
    productVariantSchema,
} from '../schemas/product.schema'
import upload from '../middlewares/upload.middleware'

const productRouter = Router()

productRouter.get('/', getProducts)

// TODO: Search routes
// productRouter.get('/search', searchProducts)

productRouter.get('/:product_id', getProduct)

productRouter.post(
    '/',
    protect,
    upload.single('image'),
    validateRequest(productSchema),
    restrictTo(Role.ADMIN),
    addProduct
)

productRouter.put(
    '/:product_id',
    protect,
    upload.single('image'),
    validateRequest(productSchema),
    restrictTo(Role.ADMIN),
    updateProduct
)

productRouter.delete('/:product_id', protect, restrictTo(Role.ADMIN), deleteProduct)

// * Product Variant
productRouter.post(
    '/:product_id/variants',
    protect,
    validateRequest(createProductVariantSchema),
    restrictTo(Role.ADMIN),
    addProductVariant
)

productRouter.put(
    '/variants/:variant_id',
    protect,
    validateRequest(productVariantSchema),
    restrictTo(Role.ADMIN),
    updateProductVariant
)

productRouter.delete('/variants/:variant_id', protect, restrictTo(Role.ADMIN), deleteProductVariant)

export default productRouter
