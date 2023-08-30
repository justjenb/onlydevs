import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      posts {
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
      posts {
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
    tags {
      _id
      name
      description
    }
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
    ... on User {
      _id
      username
    }
    ... on Post {
      title
      description
      tags {
        _id
        name
        description
      }
    }
  }
}
`;
