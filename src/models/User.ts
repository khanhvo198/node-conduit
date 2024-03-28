import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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
});

const User = mongoose.model('User', userSchema);

export { User };
