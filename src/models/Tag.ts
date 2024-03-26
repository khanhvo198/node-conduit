import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  keyword: {
    type: String,
  },
});

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
