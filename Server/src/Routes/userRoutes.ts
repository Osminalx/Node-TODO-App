import {Router} from 'express'
import {createUserController,loginController} from '../Controllers/UserController.ts'

const router = Router();

router.post('/register',createUserController)
router.post('/login',loginController)


export default router