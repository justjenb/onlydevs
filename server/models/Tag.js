const { Schema, model } = require('mongoose');

const tagSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
        type: String,
    }
  });
  
  const Tag = model('Tag', tagSchema);
  module.exports = Tag;