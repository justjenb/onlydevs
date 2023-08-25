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

router.get('/sessions/oauth', async (req, res) => {
  const code = req.query.code;
  
  try {
    const tokenData = await getAccessToken(code);
    if (tokenData.error) {
      // Handle the error, maybe redirect to an error page or send a message
      return res.status(400).json(tokenData);
    }
    
    // Set the access token as a HttpOnly cookie
    res.cookie('accessToken', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    // Redirect to the frontend without the token in the URL
    res.redirect('http://localhost:3000');

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
