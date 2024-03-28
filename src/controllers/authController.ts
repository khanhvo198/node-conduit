import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface User {
  email: string;
  username: string;
  bio?: string;
  image?: string;
  token?: string;
  password?: string;
}

const comparePassword = async (
  candidatePassword: string,
  userPassword: string
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body.user;

  if (!email || !password) {
    return next('Error');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || (await comparePassword(user.password!, password))) {
    return next('Error');
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET as jwt.Secret, {
    expiresIn: 24 * 60 * 60,
  });

  res.status(200).json({
    user: {
      email,
      token,
      username: user.username,
      bio: null,
      image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
    },
  });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, username } = req.body.user;

    const hashPassword = await bcrypt.hash(password, 12);

    await User.create({
      email,
      username,
      password: hashPassword,
    });

    const token = jwt.sign({ email }, process.env.JWT_SECRET as jwt.Secret, {
      expiresIn: 24 * 60 * 60,
    });

    res.status(200).json({
      user: {
        email,
        token,
        username,
        bio: null,
        image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
      },
    });
  } catch (error) {
    next(error);
  }
};
