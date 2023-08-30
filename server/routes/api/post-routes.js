const router = require('express').Router();
const { createPost, deletePost, updateLikes, updateComments } = require('../../controllers/post-controller');
const { authMiddleware } = require('../../utils/auth');

router.route('/posts').post(authMiddleware, createPost);
router.route('/posts/:postId').delete(authMiddleware, deletePost);
router.route('/posts/:postId/like').put(authMiddleware, updateLikes);
router.route('/posts/:postId/comment').put(authMiddleware, updateComments);

module.exports = router;
