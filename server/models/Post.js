const { Schema, model } = require('mongoose');

const postSchema = new Schema({
  user: {
    type: String,
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
  }
});
const Post = model('Post', postSchema);

module.exports = Post;