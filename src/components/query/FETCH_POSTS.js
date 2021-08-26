import gql from 'graphql-tag'
export const FETCH_POSTS = gql`
  {
    getPosts {
      username
      id
      body
      createdAt
      likeCount
      commentCount
      comments {
        username
        body
        id
        createdAt
      }
      Likes {
        username
      }
    }
  }
`