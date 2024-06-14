import { User, UserModel } from '../models/User';
import generateToken from '../utils/token.utils';
import * as bcrypt from 'bcryptjs';

export const getCurrentUser = async (id: string) => {
  const user = await UserModel.findById(id);

  const token = generateToken(id);

  return {
    email: user?.email,
    username: user?.username,
    bio: user?.bio,
    image: user?.image,
    token,
  };
};

export const updateUser = async (userPayload: User, id: string) => {
  const { email, username, password, bio, image } = userPayload;

  let hashPassword: string = '';
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

  const user = await UserModel.findByIdAndUpdate(id, userUpdated, {
    new: true,
  });

  const token = generateToken(id);

  return {
    email: user?.email,
    username: user?.username,
    bio: user?.bio,
    image: user?.image,
    token,
  };
};
