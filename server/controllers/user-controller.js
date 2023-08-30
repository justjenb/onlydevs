// import user model
const { User } = require("../models");
// import sign token function from auth
const { signToken } = require("../utils/auth");

module.exports = {
  async getSingleUser({ user = null, params }, res) {
    const foundUser = await User.findOne({
      $or: [
        { _id: user ? user._id : params.id },
        { username: params.username },
      ],
    });

    if (!foundUser) {
      return res
        .status(400)
        .json({ message: "Cannot find a user with this id!" });
    }

    res.json(foundUser);
  },

  // async createUser({ body }, res) {
  //   const user = await User.create(body);

  //   if (!user) {
  //     return res.status(400).json({ message: "Something is wrong!" });
  //   }
  //   const token = signToken(user);
  //   res.json({ token, user });
  // },

  async findOrCreateUser(email, authData, res) {
    let user = await User.findOne({ email });
  
    if (!user) {
      // Create a new user based on the authentication data
      user = new User({
        ...authData,
        email,
      });
  
      try {
        await user.save();
      } catch (error) {
        if (error.code === 11000) {
          user = await User.findOne({ email }); // Find the existing user
          if (authData.googleId) {
            user.googleId = authData.googleId;
            user.googleAccessToken = authData.googleAccessToken;
            user.googleRefreshToken = authData.googleRefreshToken;
          }
          if (authData.githubId) {
            user.githubId = authData.githubId;
            user.githubAccessToken = authData.githubAccessToken;
            user.githubRefreshToken = authData.githubRefreshToken;
          }
          await user.save();
          return user; // Return the user after updating
        }
        return res.status(500).json({ message: "Error creating user." });
      }
    } else {
      // Update the user's existing account with additional authentication data
      if (authData.googleId) {
        user.googleId = authData.googleId;
        user.googleAccessToken = authData.googleAccessToken;
        user.googleRefreshToken = authData.googleRefreshToken;
      }
      if (authData.githubId) {
        user.githubId = authData.githubId;
        user.githubAccessToken = authData.githubAccessToken;
        user.githubRefreshToken = authData.githubRefreshToken;
      }
  
      await user.save();
    }
  
    return user;
  },
  
  async login({ body }, res) {
    const user = await User.findOne({
      $or: [{ username: body.username }, { email: body.email }],
    });
    if (!user) {
      return res.status(400).json({ message: "Can't find this user" });
    }

    const correctPw = await user.isCorrectPassword(body.password);

    if (!correctPw) {
      return res.status(400).json({ message: "Wrong password!" });
    }
    const token = signToken(user);
    res.json({ token, user });
  },

  async createPost({ user, body }, res) {
    console.log(user);
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $push: { userPosts: body } },
        { new: true, runValidators: true }
      );
      return res.json(updatedUser);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },

  async deletePost({ user, params }, res) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { userPosts: { postId: params.postId } } },
      { new: true }
    );
    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "Couldn't find user with this id!" });
    }
    return res.json(updatedUser);
  },
};
