import mongoose from 'mongoose';

export interface User {
  email: string;
  username: string;
  bio: string | null;
  image: string;
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const UserModel = mongoose.model('User', userSchema);

export { UserModel };
