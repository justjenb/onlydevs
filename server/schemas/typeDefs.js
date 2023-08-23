const typeDefs = `
type User {
  _id: ID!
  username: String!
  email: String!
  password: String
  bio: String
  profilePicture: String
  posts: [Post]!
  followers: [User]!
  following: [User]!
  friends: [User]!
  postCount: Int!
}

type Post {
  _id: ID!
  user: String!
  description: String!
  link: String
  title: String
  likes: Int
}

type Tag {
  _id: ID!
  name: String!
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