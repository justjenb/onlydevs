const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const postSchema = require('./Post');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
        tags: [{
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    }],
        bio: {
            type: String,
            default: '',
  },
        profilePicture: {
            type: String,
            default: '',
        },
        posts: [postSchema],
        followers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        following: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// hash user password
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// when we query a user, we'll also get another field called `postCount` with the number of posts they have
userSchema.virtual('postCount').get(function () {
    return this.posts.length;
});

const User = model('User', userSchema);

module.exports = User;
