import { config } from 'dotenv'
import { z } from 'zod'

config()

const envSchema = z.object({
    PORT: z.number().int().default(3000),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(10),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
    console.error('Invalid environment variables', parsedEnv.error.format())
    process.exit(1)
}

export const { PORT, DATABASE_URL, JWT_SECRET, NODE_ENV } = parsedEnv.data
