import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // Clean up existing data if needed (uncomment to use)
    await deleteAllData()

    // Seed Categories
    const categories = [
        {
            name: 'T-Shirts',
            description: 'Comfortable and stylish t-shirts for everyday wear',
        },
        {
            name: 'Jeans',
            description: 'Durable and fashionable jeans for all occasions',
        },
        {
            name: 'Dresses',
            description: 'Elegant dresses for special occasions and everyday wear',
        },
        {
            name: 'Shoes',
            description: 'Footwear for all seasons and styles',
        },
        {
            name: 'Accessories',
            description: 'Complete your look with our range of accessories',
        },
    ]

    console.log('Seeding categories...')
    for (const category of categories) {
        await prisma.category.create({
            data: category,
        })
    }
    console.log('✅ Categories seeded successfully')

    // Create Admin User
    console.log('Creating admin user...')
    const hashedPassword = await bcrypt.hash('Admin#1234', 10)

    await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            address: '123 Admin Street, Admin City, AC 12345',
            phone_number: '+1234567890',
            role: Role.ADMIN,
        },
    })
    console.log('✅ Admin user created successfully')
    console.log('admin@example.com | Admin#1234')
}

// Function to delete all data from database
async function deleteAllData() {
    console.log('Deleting all records from database...')

    // Delete in the correct order to respect foreign key constraints
    await prisma.orderItem.deleteMany({})
    console.log('Deleted all order items')

    await prisma.order.deleteMany({})
    console.log('Deleted all orders')

    await prisma.productVariant.deleteMany({})
    console.log('Deleted all product variants')

    await prisma.product.deleteMany({})
    console.log('Deleted all products')

    await prisma.category.deleteMany({})
    console.log('Deleted all categories')

    await prisma.user.deleteMany({})
    console.log('Deleted all users')

    console.log('✅ All data deleted successfully')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
