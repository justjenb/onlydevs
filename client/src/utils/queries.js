import { gql } from '@apollo/client';

export const QUERY_ME = gql`
query Me {
  me {
    _id
    email
    posts {
      description
      title
      likes
      comments
    }
    username
  }
}
`;

export const QUERY_USER = gql`
  query GetUser($username: String!) {
    user(username: $username) {
      username
      email
      name
      posts {
        description
        title
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
