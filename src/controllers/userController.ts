import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import generateToken from '../utils/token.utils';
import { UserModel } from '../models/User';

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const _id = req.auth?.user?._id;
  console.log(_id);
  const user = await UserModel.findById(_id);

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
  const currentUserId = req.auth?.user?._id;

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

  await UserModel.findByIdAndUpdate(currentUserId, userUpdated);

  const token = generateToken(currentUserId!);

  res.json({
    user: userUpdated,
    token,
  });
};
