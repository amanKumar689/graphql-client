import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { Card, Image, Button, Comment, Form } from "semantic-ui-react";
import _ from "lodash";
import { FETCH_POSTS } from "../query/FETCH_POSTS";
import { PostContext } from "../../context/postStore";
import moment from "moment";
const Comments = () => {
  const history = useHistory();
  const postId = history.location.pathname.split("/")[1];
  const [comment, setComment] = useState("");
  const [post, setPost] = useState(null);
  const posts = useContext(PostContext).posts;

  useEffect(() => {
    const post = posts ? posts.filter((post) => post.id === postId)[0] : null;
    setPost(post);
  }, [posts]);
  const [commentOnPost, { loading: commentLoading }] = useMutation(
    COMMENT_ON_POST_MUTATION,
    {
      update: (proxy, result) => {
        setComment("");
        const data = proxy.readQuery({ query: FETCH_POSTS }).getPosts;
        const updatedPosts = data.map((post) => {
          if (post.id === result.data.commentPost.id) {
            const editPost = {
              ...post,
              comments: result.data.commentPost.comments,
              commentCount: post.commentCount + 1,
            };
            return editPost;
          }
          return post;
        });
        proxy.writeQuery({
          query: FETCH_POSTS,
          data: {
            ...data,
            getPosts: updatedPosts,
          },
        });
      },
      onError: (err) => {
        console.log("error", err);
      },
      variables: { postId, body: comment },
    }
  );

  // const RenderComments = () => {};
  const RenderComponent = () => {
    if (post == null) return <>Loading...</>;
    return (
      <>
        <Card className={"commentCard"}>
          <Card.Content>
            <Image
              floated="right"
              size="mini"
              src="https://react.semantic-ui.com/images/avatar/small/jenny.jpg"
            />
            <Card.Header>{post.username}</Card.Header>
            <Card.Meta>{post.createdAt}</Card.Meta>
            <Card.Description>{post.body}</Card.Description>
          </Card.Content>
          <Form style={{ width: "100%" }}>
            <Form.TextArea
              onChange={(e) => {
                setComment(e.target.value);
              }}
              value={comment}
            />
            <Button
              content="Add Comment"
              labelPosition="left"
              icon="edit"
              primary
              onClick={commentOnPost}
              disabled={commentLoading}
            />
          </Form>
          <Card.Content extra>
            {post.comments?.map((eachComment) => (
              <>
                <Comment key={eachComment.id} style={{ marginBottom: "20px" }}>
                  <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/jenny.jpg" />
                  <Comment.Content>
                    <Comment.Author as="a">
                      {eachComment.username}
                    </Comment.Author>
                    <Comment.Metadata>
                      {moment(eachComment.createdAt).fromNow()}
                    </Comment.Metadata>
                    <Comment.Text>{eachComment.body}</Comment.Text>
                  </Comment.Content>
                </Comment>
              </>
            ))}
          </Card.Content>
        </Card>
      </>
    );
  };

  return <div className={"commentBox"}>{RenderComponent()}</div>;
};

const COMMENT_ON_POST_MUTATION = gql`
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

export default Comments;
