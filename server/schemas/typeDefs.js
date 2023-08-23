const typeDefs = `
type Book {
  bookId: ID!
  authors: [String]!
  description: String!
  title: String!
  image: String
  link: String
}

type User {
  _id: ID!
  username: String!
  email: String!
  bookCount: Int!
  savedBooks: [Book]!
}

type Auth {
  token: String!
  user: User!
}

input SaveBookInput {
  authors: [String]!
  description: String
  title: String
  bookId: ID!
  image: String
  link: String
}

type Mutation {
  login(email: String!, password: String!): Auth!
  addUser(username: String!, email: String!, password: String!): Auth!
  saveBook(input: SaveBookInput!): User!
  removeBook(bookId: ID!): User!
}


  type Query {
    me: User  
  }
`;

module.exports = typeDefs;