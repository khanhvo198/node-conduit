import { NextFunction, Response, Router } from 'express';
import { Request } from 'express-jwt';
import {
  createArticle,
  createComment,
  deleteArticle,
  deleteComment,
  favoriteArticle,
  getArticles,
  getComments,
  getFeed,
  getTags,
  unfavoriteArticle,
  updateArticle,
} from '../services/articleService';
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
    try {
      const articles = await getArticles(req.query, req.auth?.user?.id);
      res.status(200).json(articles);
    } catch (error) {}
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

      res.status(201).json(article);
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const article = await updateArticle(
        req.params.slug,
        req.body.article,
        req.auth?.user?.id
      );

      res.status(200).json({ article });
    } catch (error) {}
  }
);

/**
 * @DELETE
 * delete article
 */
router.delete(
  '/articles/:slug',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteArticle(req.params.slug, req.auth?.user?.id);
      res.status(200).json({
        message: 'delete successfully',
      });
    } catch (error) {}
  }
);

router.post(
  '/articles/:slug/comments',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comment = await createComment(
        req.params.slug,
        req.body.comment,
        req.auth?.user?.id
      );

      res.status(200).json({ comment });
    } catch (error) {}
  }
);

router.get(
  '/articles/:slug/comments',
  auth.optional,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comments = await getComments(req.params.slug, req.auth?.user?.id);
      res.status(200).json({ comments });
    } catch (error) {}
  }
);

router.delete(
  '/articles/:slug/comments/:id',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteComment(req.params.slug, req.auth?.user?.id, req.params.id);
      res.status(200).json({
        message: 'delete successfully',
      });
    } catch (error) {}
  }
);

router.post(
  '/articles/:slug/favorite',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const article = await favoriteArticle(
        req.params.slug,
        req.auth?.user?.id
      );

      res.status(200).json(article);
    } catch (error) {}
  }
);

router.delete(
  '/articles/:slug/favorite',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const article = await unfavoriteArticle(
        req.params.slug,
        req.auth?.user?.id
      );

      res.status(200).json(article);
    } catch (error) {}
  }
);

router.get(
  '/articles/feed',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const feed = await getFeed(req.query, req.auth?.user?.id);
      res.status(200).json(feed);
    } catch (error) {}
  }
);

router.get(
  '/tags',
  auth.optional,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tags = await getTags();
      res.status(200).json(tags);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
