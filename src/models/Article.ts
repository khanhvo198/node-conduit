import mongoose from 'mongoose';

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

const articleSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
    },

    title: {
      type: String,
    },

    description: {
      type: String,
    },

    body: {
      type: String,
    },
    tagList: [
      {
        type: String,
      },
    ],
    favorited: {
      type: Boolean,
    },
    favoritesCount: {
      type: Number,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const ArticleModel = mongoose.model('Article', articleSchema);
export { ArticleModel };
