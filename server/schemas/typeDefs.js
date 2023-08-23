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
  type Tag {
    _id: ID!
    name: String!
    description: String
  }

type Auth {
  token: String!
  user: User!
}

type Mutation {
  login(email: String!, password: String!): Auth!
  addUser(username: String!, email: String!, password: String!): Auth!
}

type Query {
  me: User
}
`;

module.exports = typeDefs;