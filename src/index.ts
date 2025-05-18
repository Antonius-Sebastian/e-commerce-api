import express from 'express'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import yaml from 'yaml'
import morgan from 'morgan'
import cors from 'cors'

import prisma from './prisma/client'

import { errorMiddleware } from './middlewares/error.middleware'
import authRouter from './routes/auth.routes'
import productRouter from './routes/product.routes'
import userRouter from './routes/user.routes'
import categoryRouter from './routes/category.routes'
import orderRouter from './routes/order.routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/orders', orderRouter)

app.use(errorMiddleware)

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Store API!' })
})

const openApiYaml = yaml.parse(fs.readFileSync('./openapi-docs.yml', 'utf8'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiYaml))

const PORT = process.env.PORT || 8081

app.listen(PORT, () => {
    console.log(`Store API is running on port ${PORT}`)
})

process.on('SIGINT', async () => {
    await prisma.$disconnect()
    console.log('Database connection closed')
    process.exit(0)
})
