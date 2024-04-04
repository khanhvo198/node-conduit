import mongoose from 'mongoose';

export interface User {
  email: string;
  username: string | null;
  bio: string | null;
  image: string | null;
  token: string | null;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    username: {
      type: String,
    },
    bio: {
      type: String,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      select: false,
    },
    following: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    followedBy: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const UserModel = mongoose.model('User', userSchema);

export { UserModel };
