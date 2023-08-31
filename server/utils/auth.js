const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.PW_SECRET_HASH;
const expiration = "2h";

module.exports = {
  createAuthenticationError: function (message = "Could not authenticate user.") {
    return new GraphQLError(message, {
        extensions: {
            code: "UNAUTHENTICATED",
        },
    });
},
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      const decodedToken = jwt.verify(token, secret);
      const authenticatedPerson = decodedToken.authenticatedPerson;
      req.user = authenticatedPerson;
    } catch (err) {
      console.error("Token verification error:", err.message);
    }
  
    return req;
  },
  signToken: function ({ email, username, _id }) {
    const payload = { email, username, _id };
    return jwt.sign({ authenticatedPerson: payload }, secret, {
      expiresIn: expiration,
    });
  },
};
