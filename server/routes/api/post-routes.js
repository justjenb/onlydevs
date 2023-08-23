const router = require('express').Router();
const { createPost, deletePost } = require('../../controllers/user-controller');
const { authMiddleware } = require('../../utils/auth');


router.route('/').put(authMiddleware, createPost);
router.route('/:postId').delete(authMiddleware, deletePost);

module.exports = router;
