const router = require('express').Router();
const userRoutes = require('./user-routes');
const githubRoutes = require('./github-routes');
const googleRoutes = require('./google-routes');

router.use('/users', userRoutes);
router.use('/github', githubRoutes);
router.use('/google', googleRoutes);


module.exports = router;
