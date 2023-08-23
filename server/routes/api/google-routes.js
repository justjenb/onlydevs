const express = require('express');
const googleController = require('../controllers/google-controller');
const router = express.Router();

router.get('/userData', (req, res) => {
  const accessToken = req.query.accessToken;
  googleController.getUserData(accessToken).then(res => res.json(res));
});

module.exports = router;
