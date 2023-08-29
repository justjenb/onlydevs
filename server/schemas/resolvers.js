const { User, Post, Tag } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("savedPosts");
      }
      throw new AuthenticationError(ERROR_MESSAGES.auth);
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate("posts");
    },
    users: async () => {
      return User.find().populate("posts");
    },
    posts: async () => {
      return Post.find().sort({ createdAt: -1 });
    },
    post: async (parent, { postId }) => {
      return Post.findOne({ _id: postId });
    },
    getAllTags: async () => {
      return await Tag.find();
    },
    getTagById: async (_, { id }) => {
      return await Tag.findById(id);
    },
    search: async (_, { query }) => {
      if (query.startsWith('#')) {
        const tag = query.slice(1);
        return await Post.find({ tags: tag }).sort({ createdAt: -1 });
      } else if (query.startsWith('@')) {
        const username = query.slice(1);
        return await User.find({ username: new RegExp(username, 'i') });
      } else {
        const posts = await Post.find({ 
          description: new RegExp(query, 'i')
        });
        const users = await User.find({
          username: new RegExp(query, 'i')
        });
        return [...posts, ...users];
      }
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
    loginWithGoogle: async (parent, args, context) => {
      const user = context.user;
      if (!user) throw new Error("User not authenticated through Google.");
      const token = signToken(user);
      return { token, user };
    },
    logout: (parent, args, context) => {
      context.res.clearCookie("token");
      return { message: "Logged out successfully" };
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
      throw AuthenticationError('You need to be logged in!');
    },
    updateLikes: async (parent, { postId }, context) => {
      if (context.user) {
        const post = await Post.findByIdAndUpdate(
          postId,
          { $inc: { likes: 1 } },
          { new: true }
        );
        return post;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    removePost: async (parent, { postId }, context) => {
      if (context.user) {
        const post = await Post.findOneAndDelete({
          _id: postId,
          postAuthor: context.user.username,
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
        throw new AuthenticationError("Must be logged in to create a post");
      }
      const newPost = await Post.create({
        description: content,
        user: context.user._id,
      });
      return newPost;
    },
    // repost: async (parent, { postId }, context) => {
    //   if (context.user) {
    //     const post = await Post.findByIdAndUpdate(
    //       postId,
    //       { $addToSet: { reposts: context.user._id } },
    //       { new: true }
    //     );
    //     await User.findByIdAndUpdate(
    //       context.user._id,
    //       { $addToSet: { posts: post._id } }
    //     );
    //     return post;
    //   }
    //   throw new AuthenticationError('You need to be logged in!');
    // },
  },
};

module.exports = resolvers;
