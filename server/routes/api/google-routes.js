const googleController = require('../../controllers/google-controller');
const express = require('express');
const router = express.Router();

router.get('/userData', (req, res) => {
  const accessToken = req.query.accessToken;
  googleController.getUserData(accessToken)
    .then(userData => res.json(userData))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch user data.' });
    });
});

module.exports = router;
