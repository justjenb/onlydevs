const router = require('express').Router();
const {
  findOrCreateUser,
  getSingleUser,
  login,
} = require('../../controllers/user-controller');
const postRoutes = require('./post-routes');

// import middleware
const { authMiddleware } = require('../../utils/auth');

// put authMiddleware anywhere we need to send a token for verification of user
router.route('/').post(findOrCreateUser);

router.route('/login').post(login);

router.route('/profile').get(authMiddleware, getSingleUser);

router.use('/posts', postRoutes);

module.exports = router; 
