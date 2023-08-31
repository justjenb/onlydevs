import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  query Me {
    me {
      _id
      username
      email
      posts {
        _id
        user
        description
      }
    }
  }
`;

export const QUERY_USER = gql`
  {
    user {
      firstName
      lastName
      orders {
        _id
        purchaseDate
        products {
          _id
          name
          description
          price
          quantity
          image
        }
      }
    }
  }
`;

// export const QUERY_USER = gql`
//   query User($username: String!) {
//     user(username: $username) {
//       _id
//       username
//       email
//       posts {
//         _id
//         user
//         description
//         link
//         title
//         likes
//         comments
//         reposts
//         tags {
//           _id
//           name
//           description
//         }
//       }
//     }
//   }
// `;

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
