const router = require('express').Router();
const { createPost, deletePost } = require('../../controllers/post-controller');
const { authMiddleware } = require('../../utils/auth');

router.route('/posts').post(authMiddleware, createPost);
router.route('/posts/:postId').delete(authMiddleware, deletePost);

module.exports = router;
