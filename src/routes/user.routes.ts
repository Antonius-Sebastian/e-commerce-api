import { Router } from 'express'
import {
    addUser,
    deleteUser,
    getUser,
    getUsers,
    searchUsers,
    updateUser,
} from '../controllers/user.controller'
import { validateRequest } from '../middlewares/validation.middleware'
import { userSchema } from '../schemas/auth.schema'
import { protect, restrictTo } from '../middlewares/auth.middleware'
import { Role } from '@prisma/client'

const userRouter = Router()

userRouter.get('/', protect, restrictTo(Role.ADMIN), getUsers)
userRouter.get('/search', protect, restrictTo(Role.ADMIN), searchUsers)
userRouter.get('/:user_id', protect, getUser)
userRouter.post('/', protect, validateRequest(userSchema), restrictTo(Role.ADMIN), addUser)
userRouter.put('/:user_id', protect, validateRequest(userSchema), updateUser)
userRouter.delete('/:user_id', protect, restrictTo(Role.ADMIN), deleteUser)

export default userRouter
