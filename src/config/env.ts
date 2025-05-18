import { config } from 'dotenv'
import { z } from 'zod'

config()

const envSchema = z.object({
    PORT: z.coerce.number().int().default(8081),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(10),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    GCP_PROJECT_ID: z.string(),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
    console.error('Invalid environment variables', parsedEnv.error.format())
    process.exit(1)
}

export const { PORT, DATABASE_URL, JWT_SECRET, NODE_ENV, GCP_PROJECT_ID } = parsedEnv.data
