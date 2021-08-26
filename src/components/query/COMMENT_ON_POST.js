import gql from "graphql-tag";
export const COMMENT_ON_POST_MUTATION = gql`
  mutation ($postId: ID!, $body: String!) {
    commentPost(postId: $postId, body: $body) {
      id
      comments {
        username
        createdAt
        body
        id
      }
    }
  }
`;