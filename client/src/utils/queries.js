import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      thoughts {
        _id
        postText
        user
        createdAt
      }
    }
  }
`;

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      thoughts {
        _id
        thoughtText
        createdAt
      }
    }
  }
`;

export const QUERY_POSTS = gql`
query {
  posts {
    title
    user
    description
  }
}
`;

export const GET_ALL_TAGS = gql`
query {
  getAllTags {
    _id
    name
    description
  }
}
`;

export const SEARCH = gql`
  query Search($query: String!) {
    search(query: $query) {
      __typename
      ... on User {
        username
        email
      }
      ... on Post {
        user
        description
        tags
      }
    }
  }
`;