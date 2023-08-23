const axios = require('axios');

const getUserData = async (accessToken) => {
  try {
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return data;
  } catch (error) {
    return null;
  }
};

module.exports = {
  getUserData
};
