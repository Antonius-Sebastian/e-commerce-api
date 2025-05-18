import { z } from 'zod'

export const categorySchema = z.object({
    name: z
        .string()
        .min(2, 'Category name must be at least 2 characters')
        .max(50, 'Category name cannot exceed 50 characters')
        .trim(),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(500, 'Description cannot exceed 500 characters')
        .trim()
        .optional()
        .default(''),
})

export const createProductVariantSchema = z.object({
    color: z
        .string()
        .min(2, 'Color must be at least 2 characters')
        .max(30, 'Color cannot exceed 30 characters'),
    size: z
        .string()
        .min(1, 'Size must be at least 1 character')
        .max(20, 'Size cannot exceed 20 characters'),
    price: z.coerce
        .number()
        .positive('Price must be greater than 0')
        .transform((val) => Math.round(val * 100) / 100),
    stock_quantity: z
        .number()
        .int('Stock quantity must be a whole number')
        .nonnegative('Stock quantity cannot be negative')
        .default(0),
})

export const productVariantSchema = createProductVariantSchema.extend({
    product_id: z
        .number()
        .int('Product ID must be a whole number')
        .positive('Product ID must be positive'),
})

export const productSchema = z.object({
    name: z
        .string()
        .min(3, 'Product name must be at least 3 characters')
        .max(100, 'Product name cannot exceed 100 characters')
        .trim(),
    base_price: z.coerce
        .number()
        .positive('Base price must be greater than 0')
        .transform((val) => Math.round(val * 100) / 100), // Round to 2 decimal places
    category_id: z
        .number()
        .int('Category ID must be a whole number')
        .positive('Category ID must be positive'),
    description: z
        .string()
        .min(20, 'Description must be at least 20 characters')
        .max(2000, 'Description cannot exceed 2000 characters')
        .trim(),
    material: z
        .string()
        .min(2, 'Material must be at least 2 characters')
        .max(50, 'Material cannot exceed 50 characters')
        .trim(),
    brand: z
        .string()
        .min(2, 'Brand name must be at least 2 characters')
        .max(50, 'Brand name cannot exceed 50 characters')
        .trim(),
    image_url: z
        .string()
        .url('Image URL must be a valid URL')
        .startsWith('https://', 'Image URL must use HTTPS for security'),
    variants: z.array(createProductVariantSchema).optional(),
})

export type CategoryInput = z.infer<typeof categorySchema>
export type ProductInput = z.infer<typeof productSchema>
export type CreateProductVariantInput = z.infer<typeof createProductVariantSchema>
export type ProductVariantInput = z.infer<typeof productVariantSchema>
