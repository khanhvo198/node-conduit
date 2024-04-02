import * as jwt from 'jsonwebtoken';

const generateToken = (_id: string): string => {
  const token = jwt.sign(
    { user: { _id } },
    process.env.JWT_SECRET as jwt.Secret,
    {
      expiresIn: 24 * 60 * 60,
    }
  );

  return token;
};

export default generateToken;
