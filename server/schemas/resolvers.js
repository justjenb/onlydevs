const { User, Book, Tags } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express'); // Assuming you're using Apollo Server.

const ERROR_MESSAGES = {
  auth: 'Must be logged in',
  invalidCredentials: 'Invalid email or password',
  saveBook: 'Must be logged in to save book',
  removeBook: 'Must be logged in to remove book'
};

const resolvers = {
  Query: {
      me: async (parent, args, context) => {
        if (context.user) {
          return User.findOne({ _id: context.user._id }).populate('savedBooks');
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
        throw new AuthenticationError(ERROR_MESSAGES.invalidCredentials);
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError(ERROR_MESSAGES.invalidCredentials);
      }
      const token = signToken(user);
      return { token, user };
    },
    addNewUser: async (parent, { input }) => {
      const newUser = await User.create(input);
      const authToken = signToken(newUser);  // Fixed function call
      return { authToken, user: newUser };
    },
    createTag: async (_, { name, description }) => {
        return await Tags.create({ name, description });
    },
  }
};

module.exports = resolvers;