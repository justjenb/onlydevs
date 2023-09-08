const { Schema, model } = require('mongoose');
const User = './models/User';

const postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    required: 'You need to leave text!',
    minlength: 1,
    maxlength: 280,
    trim: true,
  },
  link: {
    type: String,
  },
  title: {
    type: String,
  },
  likes: {
    type: Number,
    default: 0,
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  // comments: [
  //   {
  //     commentText: {
  //       type: String,
  //       required: true,
  //       minlength: 1,
  //       maxlength: 280,
  //     },
  //     commentAuthor: {
  //       type: String,
  //       required: true,
  //     },
  //     createdAt: {
  //       type: Date,
  //       default: Date.now,
  //       get: (timestamp) => dateFormat(timestamp),
  //     },
  //   },
  // ],
  // reposts: [{
  //   type: Schema.Types.ObjectId,
  //   ref: "User"
  // }]
},
{
  timestamps: true,
});

const Post = model("Post", postSchema);

module.exports = Post;
