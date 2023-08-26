const googleController = require('../../controllers/google-controller');
const express = require('express');
const router = express.Router();

router.get('/userData', (req, res) => {
  const accessToken = req.query.accessToken;
  googleController.getUserData(accessToken).then(res => res.json(res));
});

module.exports = router;
