import mongoose from 'mongoose';

export interface Comment {
  body: string;
}

const commentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
    },

    article: {
      type: mongoose.Schema.ObjectId,
      ref: 'Article',
    },

    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const CommentModel = mongoose.model('Comment', commentSchema);

export { CommentModel };
