const { Schema, model } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedBooks` array in User.js
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