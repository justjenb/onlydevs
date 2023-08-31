const { User, Post, Tag } = require("../models");
const { signToken, createAuthenticationError } = require("../utils/auth");

const resolvers = {
  SearchResult: {
    __resolveType(obj, context, info){
      if(obj.username){
        return 'User';
      }
      if(obj.description){
        return 'Post';
      }
      return null;
    },
  },
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findById(context.user._id).populate("savedPosts");
      }
      throw createAuthenticationError();
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate("posts");
    },
    users: async () => {
      return User.find().populate("posts");
    },
    posts: async () => {
      return Post.find().sort({ createdAt: -1 }).populate('tags');
    },
    post: async (parent, { postId }) => {
      return Post.findOne({ _id: postId }).populate('tags');
    },
    getAllTags: async () => {
      return await Tag.find();
    },
    getTagById: async (_, { id }) => {
      return await Tag.findById(id);
    },
    search: async (_, { query }) => {
      if (query.startsWith('#')) {
        const tagName = query.slice(1);
        const tagData = await Tag.findOne({ name: tagName });
        if (tagData) {
          return await Post.find({ tags: tagData._id }).sort({ createdAt: -1 }).populate('tags');
        } else {
          return [];
        }
      } else if (query.startsWith('@')) {
        const username = query.slice(1);
        const users = await User.find({ username: new RegExp(username, 'i') }).populate('tags');
        if (users && users.length > 0) {
          users.forEach(user => {
            if (!user.tags || user.tags.some(tag => !tag.name)) {
              throw new Error("Tag name is missing");
            }
          });
          return users;
        }
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
        throw createAuthenticationError();
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw createAuthenticationError();
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
    addComment: async (parent, { postId, commentText }, context) => {
      if (context.user) {
        const updatedPost = Post.findOneAndUpdate(
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
        console.log('Post ID:', postId);
        console.log('Comment Text:', commentText);
        console.log('User:', context.user);
        return updatedPost;
      }
       throw createAuthenticationError('You need to be logged in!');
    },
    addPost: async (parent, { description }, context) => {
      console.log("addPost resolver called");
      console.log("Received description:", description);
      console.log("Context user:", context.user);
  
      if (context.user) {
          console.log("User is authenticated, attempting to create post");
  
          try {
              const post = await Post.create({
                  description: description,
                  user: context.user._id,
              });
              console.log("Post created:", post);
  
              const updatedUser = await User.findOneAndUpdate(
                  { _id: context.user._id },
                  { $addToSet: { posts: post._id } },
                  { new: true }
              );
              console.log("User after update:", updatedUser);
  
              return post;
          } catch (error) {
              console.error("Error while creating post or updating user:", error);
              throw error;
          }
      }
  
      console.log("User not authenticated, throwing authentication error");
      throw createAuthenticationError();
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
      throw createAuthenticationError('You need to be logged in!');
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
      throw createAuthenticationError();
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
      throw createAuthenticationError();
    },
    createTag: async (_, { name, description }) => {
      try {
        // Check if tag already exists
        let tag = await TagModel.findOne({ name, description });
        if (tag) {
          throw new Error('Tag already exists');
        }
        
        // If not, create a new tag
        tag = new TagModel({ name, description });
        await tag.save();

        return tag;
      } catch (error) {
        console.error("Error creating tag:", error);
        throw error;
      }
    },
    // createPost: async (_, { content }, context) => {
    //   if (!context.user) {
    //     throw createAuthenticationError("Must be logged in to create a post");
    //   }
    //   const newPost = await Post.create({
    //     content: content,
    //     user: context.user._id,
    //   });
    //   return newPost;
    // },
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
    //   throw new createAuthenticationError('You need to be logged in!');
    // },
  },
};

module.exports = resolvers;
