import { NextFunction, Request, Response } from 'express'
import prisma from '../prisma/client'
import { createError } from '../utils/createError'
import { CategoryInput } from '../schemas/product.schema'
import { AppError } from '../utils/AppError'
import { CATEGORY_ERRORS } from '../constants/error.constants'

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await prisma.category.findMany()

        res.json({ status: 'success', data: { categories } })
    } catch (error) {
        next(error)
    }
}

export const getCategory = async (
    req: Request<{ category_id: string }, {}, {}>,
    res: Response,
    next: NextFunction
) => {
    const category_id = parseInt(req.params.category_id, 10)
    if (isNaN(category_id)) {
        return next(createError(CATEGORY_ERRORS.INVALID_ID))
    }

    try {
        const category = await prisma.category.findUnique({
            where: {
                category_id,
            },
        })

        if (!category) {
            return next(createError(CATEGORY_ERRORS.NOT_FOUND))
        }

        res.json({ status: 'success', data: { category } })
    } catch (error) {
        next(error)
    }
}

export const addCategory = async (
    req: Request<{}, {}, CategoryInput>,
    res: Response,
    next: NextFunction
) => {
    const { name, description } = req.body
    if (!name) {
        return next(createError(CATEGORY_ERRORS.MISSING_NAME))
    }

    try {
        const category = await prisma.category.create({
            data: { name, description },
        })

        res.json({ status: 'success', data: { category } })
    } catch (error) {
        next(error)
    }
}

export const updateCategory = async (
    req: Request<{ category_id: string }, {}, CategoryInput>,
    res: Response,
    next: NextFunction
) => {
    const category_id = parseInt(req.params.category_id, 10)
    if (isNaN(category_id)) {
        return next(createError(CATEGORY_ERRORS.INVALID_ID))
    }

    try {
        const category = await prisma.category.update({
            data: { ...req.body },
            where: {
                category_id,
            },
        })
        res.json({ status: 'success', data: { category } })
    } catch (error) {
        next(error)
    }
}

export const deleteCategory = async (
    req: Request<{ category_id: string }, {}, {}>,
    res: Response,
    next: NextFunction
) => {
    console.log('disini')
    const category_id = parseInt(req.params.category_id, 10)
    console.log(category_id)
    if (isNaN(category_id)) {
        console.log('agasgoji')
        return next(createError(CATEGORY_ERRORS.INVALID_ID))
    }

    try {
        const category = await prisma.category.delete({
            where: {
                category_id,
            },
        })
        res.json({ status: 'success', data: { category } })
    } catch (error) {
        next(error)
    }
}
