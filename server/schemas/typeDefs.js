const typeDefs = `
  type User {
    _id: ID!
    username: String!
    email: String!
    posts: Int
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

  input CreateTagInput {
    name: String!
    description: String
  }

  type Mutation {
    login(email: String!, password: String!): Auth!
    addNewUser(input: NewUserInput!): Auth!
    createTag(input: CreateTagInput!): Tag
    updateTags(userId: ID!, tags: [ID!]): User
    updatePostTags(postId: ID!, tags: [ID!]): Post
  }

  type Query {
    me: User
    getAllTags: [Tag]
    getTagById(id: ID!): Tag
  }
`;

module.exports = typeDefs;
