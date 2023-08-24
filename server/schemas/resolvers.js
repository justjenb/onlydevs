const { User, Post, Tags } = require("../models");
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedPosts');
      }
      throw new AuthenticationError(ERROR_MESSAGES.auth);
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate('posts');
    },
    users: async () => {
      return User.find().populate('posts');
    },
    posts: async () => {
      return Post.find().sort({ createdAt: -1 });
    },
    post: async (parent, { thoughtId }) => {
      return Thought.findOne({ _id: thoughtId });
    },
    getAllTags: async () => {
      return await Tags.find();
    },
    getTagById: async (_, { id }) => {
      return await Tags.findById(id);
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw AuthenticationError;
      }
      const token = signToken(user);
      return { token, user };
    },

    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    addPost: async (parent, { postText }, context) => {
      if (context.user) {
        const post = await Post.create({
          postText,
          postAuthor: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { posts: post._id } }
        );

        return post;
      }
      throw AuthenticationError;
    },
    addComment: async (parent, { postId, commentText }, context) => {
      if (context.user) {
        return Post.findOneAndUpdate(
          { _id: postId },
          {
            $addToSet: {
              comments: { commentText, commentAuthor: context.user.username },
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw AuthenticationError;
    },
    removePost: async (parent, { postId }, context) => {
      if (context.user) {
        const post = await Post.findOneAndDelete({
          _id: postId,
          thoughtAuthor: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { posts: post._id } }
        );

        return post;
      }
      throw AuthenticationError;
    },
    removeComment: async (parent, { postId, commentId }, context) => {
      if (context.user) {
        return Post.findOneAndUpdate(
          { _id: postId },
          {
            $pull: {
              comments: {
                _id: commentId,
                commentAuthor: context.user.username,
              },
            },
          },
          { new: true }
        );
      }
      throw AuthenticationError;
    },
    createTag: async (_, { name, description }) => {
      return await Tags.create({ name, description });
    },
    createPost: async (_, { content }, context) => {
      if (!context.user) {
        throw new AuthenticationError('Must be logged in to create a post');
      }
      const newPost = await Post.create({ description: content, user: context.user._id });
      return newPost;
    },
  }, 
};

module.exports = resolvers;

