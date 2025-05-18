import { AppError } from './AppError'

interface ErrorObject {
    message: string
    statusCode: number
}

export const createError = ({ message, statusCode }: ErrorObject) => {
    return new AppError(message, statusCode)
}
