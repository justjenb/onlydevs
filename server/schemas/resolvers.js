const { User, Book, Tags } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedPosts');
      }
      throw new AuthenticationError(ERROR_MESSAGES.auth);
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
        throw new Error("Incorrect credentials");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new Error("Incorrect credentials");
      }
      const token = signToken(user);
      return { token, user };
    },

    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    
    createTag: async (_, { name, description }) => {
      return await Tags.create({ name, description });
    },
  }
};

module.exports = resolvers;
