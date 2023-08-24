const typeDefs = `
type User {
  _id: ID!
  username: String!
  email: String!
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

  input CreateTagInput {
    name: String!
    description: String
  }

  type Mutation {
    login(email: String!, password: String!): Auth!
    addUser(username: String!, email: String!, password: String!): Auth!
    createTag(input: CreateTagInput!): Tag
  }

  type Query {
    me: User
    getAllTags: [Tag]
    getTagById(id: ID!): Tag
  }
`;

module.exports = typeDefs;
