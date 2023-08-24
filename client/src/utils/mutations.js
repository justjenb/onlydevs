import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
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
  mutation addNewUser($input: NewUserInput!) {
    addNewUser(input: $input) {
      token
      user {
        _id
        username
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

