import 'dotenv/config';
import { Request } from 'express';
import { expressjwt as jwt } from 'express-jwt';

const getTokenFromHeader = (req: Request): string | undefined => {
  if (
    (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }

  return undefined;
};

const auth = {
  required: jwt({
    secret:
      process.env.JWT_SECRET || 'THIS_IS_VERY_SECRET_NO_BODY_KNOWS_HE_HE_HE',
    algorithms: ['HS256'],
    getToken: getTokenFromHeader,
  }),
  optional: jwt({
    secret:
      process.env.JWT_SECRET || 'THIS_IS_VERY_SECRET_NO_BODY_KNOWS_HE_HE_HE',
    algorithms: ['HS256'],
    getToken: getTokenFromHeader,
    credentialsRequired: false,
  }),
};

export default auth;
