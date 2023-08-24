const { Schema, model } = require('mongoose');

const postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  title: {
    type: String,
  },
  likes: {
    type: Number,
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }],
});
const Post = model('Post', postSchema);
module.exports = Post;
