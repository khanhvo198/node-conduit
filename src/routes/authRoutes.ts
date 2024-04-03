// import { login, register } from '../controllers/authController';
import { Router } from 'express';
import authController from '../controllers/authController';
const router = Router();

router.use(authController);

export { router as authRoutes };
