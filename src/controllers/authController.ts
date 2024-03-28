import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
const login = () => {};

interface User {
  email: String;
  username: String;
  bio?: String;
  image?: String;
  token?: String;
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);
    const newUser: User = req.body.user;
    await User.create(newUser);

    const token = jwt.sign(
      { email: newUser.email },
      process.env.JWT_SECRET as jwt.Secret,
      {
        expiresIn: 24 * 60 * 60,
      }
    );

    res.status(200).json({
      email: newUser.email,
      token,
      username: newUser.username,
      bio: null,
      image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
    });
  } catch (error) {
    console.log(error);
  }
};
