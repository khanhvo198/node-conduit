import { NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

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
