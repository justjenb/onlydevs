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
  mutation addPost($postText: String!) {
    addThought(postText: $postText) {
      _id
      postText
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
      postText
      user
      createdAt
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

export const CREATE_POST = gql`
  mutation createPost($content: String!) {
    createPost(content: $content) {
      _id
      content
    }
  }
`;

