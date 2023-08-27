const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const { authMiddleware } = require("./utils/auth");
const routes = require("./routes"); // replace with the actual path
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const passport = require("passport");

require("./config/passport-setup");

let key, cert, httpsServer;

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

if (process.env.NODE_ENV === "development") {
  key = fs.readFileSync(path.join(__dirname, "key.pem"));
  cert = fs.readFileSync(path.join(__dirname, "cert.pem"));
}

const PORT = process.env.PORT || 3001;
const app = express();

// Setup CORS
app.use(
  cors({
    origin: "https://localhost:3000", // adjust the origin to your needs
    credentials: true, // allow sending of credentials with requests
  })
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

const startApolloServer = async () => {
  await server.start();

  // Middleware for parsing
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cookieParser());

  // Session middleware
  app.use(
    session({
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        maxAge: 3600000,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Apply Apollo Server middleware
  server.applyMiddleware({ app, path: "/graphql", cors: false });

  app.use("/", routes);

  app.get("/", function (req, res) {
    res.header("Referrer-Policy", "no-referrer-when-downgrade");
  });

  // Production settings
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

  db.once("open", () => {
    if (process.env.NODE_ENV === "development") {
      httpsServer = https.createServer({ key, cert }, app);
      httpsServer.listen(PORT, () => {
        console.log(`Local HTTPS API server running on port ${PORT}!`);
        console.log(
          `Use GraphQL securely at https://localhost:${PORT}${server.graphqlPath}`
        );
      });
    } else {
      app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
      });
    }
  });
};

startApolloServer();
