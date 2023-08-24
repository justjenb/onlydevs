import { gql } from '@apollo/client';

export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

export const GET_ALL_TAGS = gql`
  query getAllTags {
    getAllTags {
      _id
      name
    }
  }
`;