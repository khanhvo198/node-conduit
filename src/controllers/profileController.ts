import { NextFunction, Response, Router } from 'express';
import { Request } from 'express-jwt';

import auth from '../middlewares/authMiddleware';
import {
  followUser,
  getProfile,
  unfollowUser,
} from '../services/profileService';

const router = Router();

/**
 * @GET
 * get profile user base on username
 */
router.get(
  '/profiles/:username',
  auth.optional,
  async (req: Request, res: Response, next: NextFunction) => {
    const profile = await getProfile(req.params.username, req.auth?.user?.id);

    res.status(200).json({ profile });
  }
);

/**
 * @POST
 * follow user
 */
router.post(
  '/profiles/:username/follow',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await followUser(
        req.params?.username,
        req.auth?.user?.id
      );

      res.status(200).json({
        profile,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @DELETE
 * un-follow user
 */
router.delete(
  '/profiles/:username/follow',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await unfollowUser(
        req.params?.username,
        req.auth?.user?.id
      );

      res.status(200).json({
        profile,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
