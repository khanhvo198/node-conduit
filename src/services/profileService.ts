import { UserModel } from '../models/User';
import HttpException from '../utils/http-exception.model';

export const getProfile = async (username: string, id: string) => {
  const user = await UserModel.findOne({ username });

  if (!user) {
    throw new HttpException(404, {});
  }

  const isFollowing = user.followedBy.some(
    (followingUser) => followingUser.toHexString() === id
  );

  return {
    username: user.username,
    bio: user.bio,
    image: user.image,
    following: id ? isFollowing : false,
  };
};

export const followUser = async (username: string, id: string) => {
  const user = await UserModel.findOneAndUpdate(
    { username },
    { $push: { followedBy: id } }
  );

  if (!user) {
    throw new HttpException(422, {});
  }

  await UserModel.findByIdAndUpdate(id, { $push: { following: user.id } });

  return {
    username: user.username,
    bio: user.bio,
    image: user.image,
    following: true,
  };
};

export const unfollowUser = async (username: string, id: string) => {
  const user = await UserModel.findOneAndUpdate(
    { username },
    { $pull: { followedBy: id } }
  );

  if (!user) {
    throw new HttpException(422, {});
  }

  await UserModel.findByIdAndUpdate(id, { $pull: { following: user.id } });
  return {
    username: user.username,
    bio: user.bio,
    image: user.image,
    following: false,
  };
};
