const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const getAccessToken = async (code) => {
  try {
    const params = `?client_id=${process.env.GITHUB_OAUTH_CLIENT_ID}&client_secret=${process.env.GITHUB_OAUTH_CLIENT_SECRET}&code=${code}`;

    const { data } = await axios.post(
      `https://github.com/login/oauth/access_token${params}`,
      {},
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (data.error) {
      throw new Error(data.error_description || "Error fetching access token");
    }

    return data;

  } catch (error) {
    console.error(error.message || error);
    return { error: error.message || "Unexpected error occurred" };
  }
};

const getUserData = async (accessToken) => {
  try {
    const { data } = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return data;

  } catch (error) {
    console.error(error.message || error);
    return { error: error.message || "Unexpected error occurred" };
  }
};

module.exports = {
  getAccessToken,
  getUserData
};
