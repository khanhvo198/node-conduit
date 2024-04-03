import { NextFunction, Response, Router } from 'express';
import { Request } from 'express-jwt';
import { login, register } from '../services/authService';

const router = Router();

router.post(
  '/users',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await register({ ...req.body.user });
      res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/users/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await login({ ...req.body.user }, next);
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
