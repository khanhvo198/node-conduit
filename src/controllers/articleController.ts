import { NextFunction, Response, Router } from 'express';
import { Request } from 'express-jwt';
import { createArticle } from '../services/articleService';
import auth from '../middlewares/authMiddleware';

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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const article = await createArticle(req.body.article, req.auth?.user?.id);

      res.status(201).json({
        article,
      });
    } catch (error) {}
  }
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
