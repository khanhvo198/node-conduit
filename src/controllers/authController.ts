import bcrypt from 'bcryptjs';
import { NextFunction, Response } from 'express';
import { Request } from 'express-jwt';
import generateToken from '../utils/token.utils';
import { UserModel } from '../models/User';

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

  const user = await UserModel.findOne({ email }).select('+password');

  if (!user || (await comparePassword(user.password!, password))) {
    return next('Error');
  }

  const token = generateToken(user.id);

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

    const user = await UserModel.create({
      email,
      username,
      password: hashPassword,
      bio: null,
      image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
    });

    const token = generateToken(user.id);

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
