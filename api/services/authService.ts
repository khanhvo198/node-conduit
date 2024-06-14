import * as bcrypt from 'bcryptjs';
import { NextFunction } from 'express';
import { User, UserModel } from '../models/User';
import generateToken from '../utils/token.utils';
import HttpException from '../utils/http-exception.model';

const comparePassword = async (
  candidatePassword: string,
  userPassword: string
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export const register = async (user: User) => {
  const { email, password, username } = user;

  const hashPassword = await bcrypt.hash(password, 12);

  const newUser = await UserModel.create({
    email,
    username,
    password: hashPassword,
    bio: null,
    image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
  });

  const token = generateToken(newUser.id);

  return {
    email: newUser.email,
    username: newUser.username,
    bio: newUser.bio,
    image: newUser.image,
    token,
  };
};

export const login = async (userPayload: User, next: NextFunction) => {
  const { email, password } = userPayload;

  if (!email) {
    throw new HttpException(422, { errors: { email: ["can't be blank"] } });
  }

  if (!password) {
    throw new HttpException(422, { errors: { password: ["can't be blank"] } });
  }

  const user = await UserModel.findOne({ email }).select('+password');

  if (!user || (await comparePassword(user.password!, password))) {
    throw new HttpException(403, {
      errors: { 'email or password': ['is invalid'] },
    });
  }

  const token = generateToken(user.id);

  return {
    email: user.email,
    username: user.username,
    bio: user.bio,
    image: user.image,
    token,
  };
};
