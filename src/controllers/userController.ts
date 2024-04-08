import { NextFunction, Response, Router } from 'express';
import { Request } from 'express-jwt';
import auth from '../middlewares/authMiddleware';
import { getCurrentUser, updateUser } from '../services/userService';

const router = Router();

/**
 * @GET
 * handle get current user
 */
router.get(
  '/user',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await getCurrentUser(req.auth?.user?.id);
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @PUT
 * handle update user
 */
router.put(
  '/user',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await updateUser(req.body.user, req.auth?.user?.id);
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
