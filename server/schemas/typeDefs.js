const typeDefs = `
type User {
  _id: ID
  username: String
  email: String
  password: String
  posts: [Post]
  savedPosts: [Post]
}

type Tag {
  _id: ID!
  name: String!
  description: String
}

type Post {
  _id: ID!
  user: String
  description: String
  title: String
  likes: Int
  comments: [ID!]
  reposts: [ID!]
  tags: [Tag]
}

type Comment {
  _id: ID
  commentText: String
  commentAuthor: String
  createdAt: String
}

type Auth {
  token: ID
  user: User
}

input CreateTagInput {
  name: String!
  description: String
}

input CreatePostInput {
  user: ID!
  description: String!
  link: String
  title: String
  tags: [ID]
}

union SearchResult = User | Post

type LogoutResponse {
  message: String!
}

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    createTag(name: String!): Tag!
    updateTags(userId: ID!, tags: [ID!]): User
    updatePostTags(postId: ID!, tags: [ID!]): Post
    updateLikes(postId: ID!): Post
    addPost(description: String!): Post
    addComment(postId: ID!, commentText: String!): Post
    removePost(postId: ID!): Post
    removeComment(postId: ID!, commentId: ID!): Post
    loginWithGoogle(token: String!): Auth
    logout: LogoutResponse!
    repost(postId: ID!): Post
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
