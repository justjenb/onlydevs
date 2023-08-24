import { getAccessToken, getUserData } from '../controllers/github-controller';
const router = require('express').Router();

router.get('/accessToken', (req, res) => {
  const code = req.query.code;
  getAccessToken(code).then(res => res.json(res));
});

router.get('/userData', (req, res) => {
  const accessToken = req.query.accessToken;
  getUserData(accessToken).then(res => res.json(res));
});

module.exports = router;
