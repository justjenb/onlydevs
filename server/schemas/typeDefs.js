const typeDefs = `
  type User {
    _id: ID!
    username: String!
    email: String!
    posts: Int
    savedBooks: [Book]  # Assuming saved books return a list of Book objects
  }

  type Book {
    _id: ID!
    title: String!
    authors: [String]!
    description: String
    image: String
    link: String
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

  input NewUserInput {
    username: String!
    email: String!
    password: String!
  }

  input SaveBookInput {
    bookId: ID!
  }

  input CreateTagInput {
    name: String!
    description: String
  }

  type Mutation {
    login(email: String!, password: String!): Auth!
    addNewUser(input: NewUserInput!): Auth!
    addSavedBook(input: SaveBookInput!): User
    removeSavedBook(bookId: ID!): User
    createTag(input: CreateTagInput!): Tag
  }

  type Query {
    me: User
    getAllTags: [Tag]
    getTagById(id: ID!): Tag
  }
`;

module.exports = typeDefs;
