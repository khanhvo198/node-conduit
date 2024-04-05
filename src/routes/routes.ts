import { Router } from 'express';
import authController from '../controllers/authController';
import userController from '../controllers/userController';
import profileController from '../controllers/profileController';
const router = Router();

router.use(authController).use(userController).use(profileController);

export default router;
