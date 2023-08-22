const typeDefs = `
  type User {
    _id: ID!
    username: String
    email: String
    password: String
    posts: INT
  }
  type Post {
    user: String!
    description: String!
    postId: String!
    link: String
    title: String
    likes: INT
  }
  type TAGs {
    bookID: String
    title: String
    author: String
    description: String
    image: String
    link: String
  }

`;

module.exports = typeDefs;
