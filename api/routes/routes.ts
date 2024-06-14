import { Router } from 'express';
import authController from '../controllers/authController';
import userController from '../controllers/userController';
import profileController from '../controllers/profileController';
import articleController from '../controllers/articleController';
const router = Router();

router
  .use(authController)
  .use(userController)
  .use(profileController)
  .use(articleController);

export default router;
