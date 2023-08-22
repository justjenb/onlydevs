const { User, Book } = require('../models');
const { AuthenticationError } = require('your-auth-library');

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
        const userData = await User.findOne({ _id: context.user._id });
        return userData;
      }
      throw new AuthenticationError(ERROR_MESSAGES.auth);
    },
  },
  Mutation: {
    loginUser: async (parent, { input }) => {
      const { email, password } = input;
      const foundUser = await User.findOne({ email });
    
      if (!foundUser) {
        throw new AuthenticationError(ERROR_MESSAGES.invalidCredentials);
      }
    
      const isPasswordCorrect = await foundUser.isCorrectPassword(password);
    
      if (!isPasswordCorrect) {
        throw new AuthenticationError(ERROR_MESSAGES.invalidCredentials);
      }
    
      const authToken = generateAuthToken(foundUser);
      return { authToken, user: foundUser };
    },
    
    addNewUser: async (parent, { input }) => {
      const newUser = await User.create(input);
      const authToken = generateAuthToken(newUser);
      return { authToken, user: newUser };
    },
    
    addSavedBook: async (parent, { input }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: input } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError(ERROR_MESSAGES.saveBook);
    },
    
    removeSavedBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError(ERROR_MESSAGES.removeBook);
    } 
  }
};

module.exports = resolvers;
