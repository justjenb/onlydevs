// const { Post, User } = require('../models');

// const createPost = async (req, res) => {
//   try {
//     // get post
//     const { content } = req.body;
//     // create post
//     const newPost = await Post.create({
//       content,
//       user: req.user._id, 
//     });

//     // add post to posts
//     await User.findByIdAndUpdate(
//       req.user._id,
//       { $push: { posts: newPost._id } },
//       { new: true }
//     );

//     return res.json(newPost);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'An error occurred while creating the post.' });
//   }
// };

// const deletePost = async (req, res) => {
//   try {
//     const { postId } = req.params;

//     // delete post
//     const deletedPost = await Post.findOneAndDelete({
//       _id: postId,
//       user: req.user._id, // Ensure the post is owned by the authenticated user
//     });

//     if (!deletedPost) {
//       return res.status(404).json({ message: 'Post not found or you do not have permission to delete it.' });
//     }

//     // delete post from posts
//     await User.findByIdAndUpdate(
//       req.user._id,
//       { $pull: { posts: postId } },
//       { new: true }
//     );

//     return res.json({ message: 'Post deleted successfully.' });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'An error occurred while deleting the post.' });
//   }
// };

// const updateLikes = async (req, res) => {
//   console.log('hello Luis');
//   try{
//     const postId = req.params.postId;
//     const post = await Post.findById(postId);

//     // check if user already liked post
//     if (post.likes.includes(context.user._id)) {
//       // remove like
//       post.likes = post.likes.filter((id) => id.toString() !== context.user._id.toString());
//     } else {
//       // add like
//       post.likes.push(context.user._id);
//     }
//     const updatedPost = await post.save();
//     res.status(200).json(updatedPost);
//     return updatedPost;
//   }catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'An error occurred.' });
//   }
// }

// const updateComments = async (req, res) => {
//   try{
//     const postId = req.params.postId;
//     const userId = req.user.id;
//     const post = await Post.findById(postId);

//     // check if user already liked post
//     if (post.comments.includes(userId)) {
//       // remove like
//       post.comments = post.comments.filter((id) => id.toString() !== userId.toString());
//     } else {
//       // add like
//       post.comments.push(userId);
//     }
//     const updatedPost = await post.save();
//     res.status(200).json(updatedPost);
//   }catch (error){
//     console.error(error);
//     return res.status(500).json({ message: 'An error occurred.' });
//   }
// }
// module.exports = {
//   updateLikes,
//   createPost,
//   deletePost,
//   updateComments
// };
