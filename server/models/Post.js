const { Schema } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedBooks` array in User.js
const postSchema = new Schema({
  user: [
    {
      type: String,
      required : true,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  // saved book id from GoogleBooks
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
    type: INT,
  }
});

module.exports = postSchema;