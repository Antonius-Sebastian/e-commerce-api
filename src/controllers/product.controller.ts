import { Request, Response, NextFunction } from 'express'

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: 'Product list' })
}

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    res.json({ message: `Product details for product ${id}` })
}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { name, price } = req.body
    res.status(201).json({ message: 'Product created', product: { name, price } })
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { name, price } = req.body
    res.json({ message: `Product ${id} updated`, product: { name, price } })
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    res.json({ message: `Product ${id} deleted` })
}
