const { Schema, model } = require('mongoose');

const Post = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // You can expand this schema to add images, likes, comments, etc.
});

module.exports = Post;
