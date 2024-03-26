import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
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
  tagList: {
    type: String,
  },
  favorited: {
    type: Boolean,
  },
  favoritesCount: {
    type: Number,
  },
});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;
