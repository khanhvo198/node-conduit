import { Router } from 'express';
import { getCurrentUser, updateUser } from '../controllers/userController';
import auth from '../middlewares/authMiddleware';

const router = Router();

router
  .route('/user')
  .get(auth.required, getCurrentUser)
  .put(auth.required, updateUser);

export { router as userRoutes };
