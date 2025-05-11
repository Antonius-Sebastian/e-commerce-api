import express from 'express'

import { PORT } from './config/env'
import prisma from './prisma/client'

import { errorMiddleware } from './middlewares/error.middleware'
import authRouter from './routes/auth.routes'
import productRouter from './routes/product.routes'
import userRouter from './routes/user.routes'

const app = express()

app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/products', productRouter)

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Store API!' })
})

app.use(errorMiddleware)

app.listen(PORT, () => {
    console.log(`Store API is running on http://localhost:${PORT}`)
})

process.on('SIGINT', async () => {
    await prisma.$disconnect()
    console.log('Database connection closed')
    process.exit(0)
})
