import { NextFunction, Router, Response } from 'express';
import auth from '../middlewares/authMiddleware';
import { Request } from 'express-jwt';
import { ArticleModel } from 'models/Article';

const router = Router();

/**
 * @GET
 * get all articles
 */
router.get(
  '/articles',
  auth.optional,
  async (req: Request, res: Response, next: NextFunction) => {
    // const articles = await ArticleModel.findMany()
    
    res.json('hahahahahaha');
  }
);

/**
 * @POST
 * create new article
 */
router.post(
  '/articles',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {}
);

/**
 * @PUT
 * edit article
 */
router.put(
  '/articles/:slug',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {}
);

/**
 * @DELETE
 * delete article
 */
router.delete(
  '/articles/:slug',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {}
);

export default router;
