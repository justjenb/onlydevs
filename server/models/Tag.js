const { Schema } = require('mongoose');

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
  
  const Tags = model('Tag', tagSchema);

  module.exports = Tags;