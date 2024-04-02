import 'express';

declare module 'express' {
  export interface Request {
    auth?: {
      user?: {
        _id: string;
      };
    };
  }
}
