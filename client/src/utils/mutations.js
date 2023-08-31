import { gql } from '@apollo/client';


export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
mutation Logout {
  logout {
    message
  }
}
`;

export const CREATE_TAG = gql`
mutation CreateTag($name: String!, $description: String) {
  createTag(name: $name, description: $description) {
    _id
    name
    description
  }
}
`;


export const LOGIN_WITH_GOOGLE = gql`
mutation LoginWithGoogle($token: String!) {
  loginWithGoogle(token: $token) {
    token
    user {
      _id
      username
      email
    }
  }
}
`;

export const ADD_USER = gql`
  mutation AddUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;


export const ADD_POST = gql`
  mutation addPost($description: String!) {
    addThought(description: $description) {
      _id
      description
      user
      createdAt
      comments {
        _id
        commentText
      }
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation addComment($postId: ID!, $commentText: String!) {
    addComment(postId: $postId, commentText: $commentText) {
      _id
      comments {
        _id
        commentText
        createdAt
      }
    }
  }
`;

export const UPDATE_TAGS = gql`
  mutation updateTags($userId: ID!, $tags: [ID!]) {
    updateTags(userId: $userId, tags: $tags) {
      _id
      tags
    }
  }
`;

export const UPDATE_POST_TAGS = gql`
  mutation updatePostTags($postId: ID!, $tags: [ID!]) {
    updatePostTags(postId: $postId, tags: $tags) {
      _id
      tags
    }
  }
`;

export const UPDATE_LIKES = gql`
  mutation updateLikes($postId: ID!) {
    updateLikes(postId: $postId) {
      _id
      likes
    }
  }
`;

export const CREATE_POST = gql`
  mutation createPost($content: String!) {
    createPost(content: $content) {
      _id
      content
    }
  }
`;

export const REPOST = gql`
  mutation repost($postId: ID!) {
    repost(postId: $postId) {
      _id
      reposts
    }
  }
`;

