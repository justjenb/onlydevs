const typeDefs = `
type User {
  _id: ID
  username: String
  email: String
  password: String
}

type Tag {
  _id: ID!
  name: String!
  description: String
}

type Post {
  _id: ID!
  user: String
  description: String!
  link: String
  title: String
  likes: [Int]
}

type Comment {
  _id: ID
  commentText: String
  commentAuthor: String
  createdAt: String
}

type Auth {
  token: ID!
  user: User!
}

input CreateTagInput {
  name: String!
  description: String
}

input CreatePostInput {
  user: ID!
  postText: String!
  link: String
  title: String
  tags: [ID]
}

union SearchResult = User | Post

  type Mutation {
    login(email: String!, password: String!): Auth!
    addUser(username: String!, email: String!, password: String!): Auth!
    createTag(input: CreateTagInput!): Tag
    updateTags(userId: ID!, tags: [ID!]): User
    updatePostTags(postId: ID!, tags: [ID!]): Post
    addPost(postText: String!): Post
    addComment(postId: ID!, commentText: String!): Post
    removePost(postId: ID!): Post
    removeComment(postId: ID!, commentId: ID!): Post
    createPost(input: CreatePostInput!): Post
  }

  type Query {
    me: User
    user(username: String!): User
    users: [User]
    posts(username: String): [Post]
    post(postId: ID!): Post
    getAllTags: [Tag]
    getTagById(id: ID!): Tag
    search(query: String!): [SearchResult]
  }
`;

module.exports = typeDefs;
