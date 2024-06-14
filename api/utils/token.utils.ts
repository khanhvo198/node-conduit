import * as jwt from 'jsonwebtoken';

const generateToken = (id: string): string => {
  const token = jwt.sign(
    { user: { id } },
    process.env.JWT_SECRET as jwt.Secret,
    {
      expiresIn: 24 * 60 * 60,
    }
  );

  return token;
};

export default generateToken;
