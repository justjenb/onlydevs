const router = require('express').Router();
const {
  findOrCreateUser,
  getSingleUser,
  login,
} = require('../../controllers/user-controller');

// import middleware
const { authMiddleware } = require('../../utils/auth');

// put authMiddleware anywhere we need to send a token for verification of user
router.route('/').post(findOrCreateUser);

router.route('/login').post(login);

router.route('/profile').get(authMiddleware, getSingleUser);

module.exports = router; 
