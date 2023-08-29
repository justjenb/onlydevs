const { getAccessToken, getUserData } = require('../../controllers/github-controller');
const express = require('express');
const router = express.Router();

router.get('/accessToken', (req, res) => {
  const code = req.query.code;
  getAccessToken(code)
    .then(response => res.json(response))
    .catch(err => {
      console.error(err);
      res.status(500).send('Error retrieving access token.');
    });
});

router.get('/userData', (req, res) => {
  const accessToken = req.query.accessToken;
  getUserData(accessToken)
    .then(response => res.json(response))
    .catch(err => {
      console.error(err);
      res.status(500).send('Error retrieving user data.');
    });
});

router.get('/callback', async (req, res) => {
  const code = req.query.code;
  console.log(`Token code ${tokenData}`)

  try {
    const tokenData = await getAccessToken(code);
    console.log(`Token Data ${tokenData}`)
    if (tokenData.error) {
      return res.status(400).json(tokenData);
    }

    const githubProfile = await getGitHubProfile(tokenData.access_token);
    
    let user = await User.findOne({
      $or: [{ email: githubProfile.email }, { username: githubProfile.login }],
    });

    if (!user) {
      user = await User.create({
        username: githubProfile.login,
        email: githubProfile.email,
        // ... any other fields you want from the GitHub profile
      });
    }

    const token = signToken(user);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    res.redirect('https://localhost:3000');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
