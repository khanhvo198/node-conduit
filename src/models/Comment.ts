import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
  },
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
