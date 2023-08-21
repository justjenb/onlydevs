const typeDefs = `
  type User {
    _id: ID!
    username: String
    email: String
    password: String
    books: INT
  }
  type Book {
    bookID: String
    title: String
    author: String
    description: String
    image: String
    link: String
  }
  type BookData {
    bookID: String
    title: String
    author: String
    description: String
    image: String
    link: String
  }

`;

module.exports = typeDefs;
