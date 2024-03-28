import { login, register } from '../controllers/authController';
import { Router } from 'express';

const router = Router();

router.route('/users').post(register);
router.route('/users/login').post(login);

export { router as authRoutes };
