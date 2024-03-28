import { register } from '../controllers/authController';
import { Router } from 'express';

const router = Router();

router.route('/users').post(register);

export { router as authRoutes };
