import mongoose from 'mongoose';

export interface Comment {
  body: string;
}

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
  },

  article: {
    type: mongoose.Schema.ObjectId,
    ref: 'Article',
  },
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
