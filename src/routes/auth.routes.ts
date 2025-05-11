import { Router } from 'express'
import { signIn, signOut, signUp } from '../controllers/auth.controller'
import { validateRequest } from '../middlewares/validation.middleware'
import { signInSchema, userSchema } from '../schemas/authSchema'
import { protect } from '../middlewares/auth.middleware'

const authRouter = Router()

authRouter.post('/sign-in', validateRequest(signInSchema), signIn)
authRouter.post('/sign-up', validateRequest(userSchema), signUp)
authRouter.post('/sign-out', protect, signOut)
authRouter.get('/me', protect, (req, res) => {
    res.json(req.user)
})
export default authRouter
