import bcrypt from 'bcryptjs';
import { NextFunction, Response } from 'express';
import { Request } from 'express-jwt';
import generateToken from '../utils/token.utils';
import { UserModel } from '../models/User';

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.auth?.user?.id;
  const user = await UserModel.findById(id);

  res.json({
    user,
  });
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userPayload = req.body.user;
  const id = req.auth?.user?.id;

  const { email, username, password, bio, image } = userPayload;

  let hashPassword;
  if (password) {
    hashPassword = await bcrypt.hash(password, 12);
  }

  const userUpdated = {
    ...(email ? { email } : {}),
    ...(username ? { username } : {}),
    ...(password ? { password: hashPassword } : {}),
    ...(bio ? { bio } : {}),
    ...(image ? { image } : {}),
  };

  await UserModel.findByIdAndUpdate(id, userUpdated);

  const token = generateToken(id!);

  res.json({
    user: userUpdated,
    token,
  });
};
