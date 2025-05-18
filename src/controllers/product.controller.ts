import { Request, Response, NextFunction } from 'express'

import prisma from '../prisma/client'
import { createError } from '../utils/createError'
import { ProductInput, ProductVariantInput } from '../schemas/product.schema'
import { PRODUCT_ERRORS, PRODUCT_VARIANTS_ERRORS } from '../constants/error.constants'

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await prisma.product.findMany({
            include: { category: true, variants: true },
            omit: {
                category_id: true,
            },
        })
        res.json({ status: 'success', data: { products } })
    } catch (error) {
        next(error)
    }
}

export const getProduct = async (
    req: Request<{ product_id: string }, {}, {}>,
    res: Response,
    next: NextFunction
) => {
    const product_id = parseInt(req.params.product_id, 10)

    if (isNaN(product_id)) {
        return next(createError(PRODUCT_ERRORS.INVALID_ID))
    }

    try {
        const product = await prisma.product.findUnique({
            include: { category: true, variants: true },
            where: {
                product_id,
            },
        })

        // * Log for debugging
        console.log('get product')
        console.log(product_id)
        console.log(product)

        if (!product) {
            return next(createError(PRODUCT_ERRORS.NOT_FOUND))
        }

        res.json({ status: 'success', data: { product } })
    } catch (error) {
        next(error)
    }
}

// TODO: Product search controller
// export const searchProducts = async (
//     req: Request<{}, {}, {}>,
//     res: Response,
//     next: NextFunction
// ) => {
//     const { keyword } = req.query
// }

export const addProduct = async (
    req: Request<{}, {}, ProductInput>,
    res: Response,
    next: NextFunction
) => {
    const { variants, ...productData } = req.body
    try {
        // validate category_id
        const categoryExists = await prisma.category.findUnique({
            where: { category_id: productData.category_id },
        })
        if (!categoryExists) {
            return next(createError(PRODUCT_ERRORS.INVALID_CATEGORY))
        }

        const product = await prisma.product.create({
            data: {
                name: productData.name,
                base_price: productData.base_price,
                description: productData.description,
                material: productData.material,
                brand: productData.brand,
                image_url: productData.image_url,
                // Use the correct relation syntax for category
                category: {
                    connect: { category_id: productData.category_id },
                },
                variants:
                    variants && variants.length > 0
                        ? {
                              create: variants.map((variant) => ({
                                  color: variant.color!,
                                  size: variant.size!,
                                  price: variant.price!,
                                  stock_quantity: variant.stock_quantity!,
                              })),
                          }
                        : undefined,
            },
            include: {
                variants: true,
                category: true,
            },
        })

        // * Log for debugging
        console.log('add product')
        console.log(variants)
        console.log(productData)
        console.log(product)

        res.status(201).json({ status: 'success', data: { product } })
    } catch (error) {
        next(error)
    }
}

export const updateProduct = async (
    req: Request<{ product_id: string }, {}, ProductInput>,
    res: Response,
    next: NextFunction
) => {
    const product_id = parseInt(req.params.product_id, 10)
    if (isNaN(product_id)) {
        return next(createError(PRODUCT_ERRORS.INVALID_ID))
    }

    const { variants, ...productData } = req.body

    try {
        const existingProduct = await prisma.product.findUnique({
            where: {
                product_id,
            },
        })

        if (!existingProduct) {
            return next(createError(PRODUCT_ERRORS.NOT_FOUND))
        }

        const product = await prisma.product.update({
            data: { ...productData },
            where: {
                product_id,
            },
        })

        // * Log for debugging
        console.log('Update product')
        console.log(product_id)
        console.log(existingProduct)
        console.log(product)

        res.json({ status: 'success', data: { product } })
    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (
    req: Request<{ product_id: string }, {}, {}>,
    res: Response,
    next: NextFunction
) => {
    const product_id = parseInt(req.params.product_id)
    if (isNaN(product_id)) {
        return next(createError(PRODUCT_ERRORS.INVALID_ID))
    }

    try {
        const product = await prisma.product.delete({
            where: { product_id },
        })
        res.json({ status: 'success', data: { product } })
    } catch (error) {
        next(error)
    }
}

// TODO:
export const addProductVariant = async (
    req: Request<{}, {}, ProductVariantInput>,
    res: Response,
    next: NextFunction
) => {
    const { color, price, product_id, size, stock_quantity } = req.body
    try {
        const existingProductVariant = await prisma.productVariant.findUnique({
            where: {
                product_id_color_size: {
                    product_id,
                    color,
                    size,
                },
            },
        })
        if (existingProductVariant) {
            return next(createError(PRODUCT_VARIANTS_ERRORS.ALREADY_EXISTS))
        }

        const productVariant = await prisma.productVariant.create({
            data: { color, price, stock_quantity, product_id, size },
        })

        res.json({ status: 'success', data: { productVariant } })
    } catch (error) {
        next(error)
    }
}

export const updateProductVariant = async (
    req: Request<{ variant_id: string }, {}, ProductVariantInput>,
    res: Response,
    next: NextFunction
) => {
    const { color, price, product_id, size, stock_quantity } = req.body

    const variant_id = parseInt(req.params.variant_id, 10)
    if (isNaN(variant_id)) {
        return next(createError(PRODUCT_VARIANTS_ERRORS.INVALID_ID))
    }

    try {
        const existingProductVariant = await prisma.productVariant.findUnique({
            where: { variant_id },
        })
        if (!existingProductVariant) {
            return next(createError(PRODUCT_VARIANTS_ERRORS.NOT_FOUND))
        }

        const productVariant = await prisma.productVariant.update({
            data: {
                color,
                price,
                product_id,
                size,
                stock_quantity,
            },
            where: { variant_id },
        })

        res.json({ status: 'success', data: { productVariant } })
    } catch (error) {
        next(error)
    }
}

export const deleteProductVariant = async (
    req: Request<{ variant_id: string }, {}, {}>,
    res: Response,
    next: NextFunction
) => {
    const variant_id = parseInt(req.params.variant_id)
    if (isNaN(variant_id)) {
        return next(createError(PRODUCT_VARIANTS_ERRORS.INVALID_ID))
    }

    try {
        const existingProductVariant = await prisma.productVariant.findUnique({
            where: {
                variant_id,
            },
        })
        if (!existingProductVariant) {
            return next(createError(PRODUCT_VARIANTS_ERRORS.NOT_FOUND))
        }

        const productVariant = await prisma.productVariant.delete({
            where: { variant_id },
        })

        res.json({ status: 'success', data: { productVariant } })
    } catch (error) {
        next(error)
    }
}
