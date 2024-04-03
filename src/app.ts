import express from 'express';
import HttpException from './utils/http-exception.model';
import { Request, Response, NextFunction } from 'express';
import routes from './routes/routes';

const app = express();

app.use(express.json());

app.use('/api', routes);

app.use(
  (
    err: Error | HttpException,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // @ts-ignore
    if (err && err.errorCode) {
      // @ts-ignore
      res.status(err.errorCode).json(err.message);
    }
  }
);

export default app;
