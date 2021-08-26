import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { FETCH_POSTS } from "./query/FETCH_POSTS";
import { AuthContext } from "../context/auth";
import _ from "lodash";
import spinLoader from '../spinLoader.svg'
const PostCard = ({ username, body, likeCount, commentCount, id, Likes }) => {
  const history = useHistory();
  const postContext = useContext(AuthContext);
  const authContext = useContext(AuthContext);
  const [likePost,{loading:likeLoading}] = useMutation(Like_query, {
    update: (proxy, result) => {
      const data = proxy.readQuery({
        query: FETCH_POSTS,
      });
      const newData = data.getPosts.map((post) => {
        if (post.username === postContext.user.username) {
          return {
            ...post,
            likeCount: post.likeCount + 1,
          };
        }
        return post;
      });
      proxy.writeQuery({
        query: FETCH_POSTS,
        data: {
          ...data,
          getPosts: {
            newData,
          },
        },
      });
    },
    onError: (err) => {
      console.log("err--", err);
    },
    variables: { postId: id },
  });

  // delete query

  const [deletePost, { loading:deleteLoading }] = useMutation(deletePost_query, {
    update: (proxy, result) => {
      console.log("result", result);
      const data = proxy.readQuery({
        query: FETCH_POSTS,
      });
      const newData = data.getPosts.filter((post) => post.id !== id);

      proxy.writeQuery({
        query: FETCH_POSTS,
        data: {
          ...data,
          getPosts: newData,
        },
      });
    },
    onError: (err) => {
      console.log(err);
    },
    variables: { postId: id },
  });

  const Like_Handler = () => {
    if (postContext.user === null) {
      return history.push("/register");
    }
    likePost();
  };

  const Go_to_commentPage = () => {
    if (postContext.user === null) return history.push("/register");
    history.push(`/${id}/comments`);
    //  setRedirectStatus(true)
  };
console.log("deleteLoading",deleteLoading)
  const deletePostHandler = () => {
    deletePost();
  };
  return (
    <div className="ui card" >
      <div className="content">
        <div className="right floated meta">14h</div>
        <img
          alt={"avatar"}
          className="ui avatar image"
          src="https://semantic-ui.com/images/avatar/large/elliot.jpg"
        />
        {username}
      </div>
      <div className="image" style={{ padding: "15px" }}>
        {body}
      </div>
      <div className="content">
        <span className="right floated" >
         { likeLoading ? (<img  alt={'loader'} width={"25px"}  src={spinLoader} />) 
         : (<i
            className={`heart ${
              _.find(Likes, {
                username:
                  postContext.user != null ? postContext.user.username : "",
              })
                ? ""
                : "outline"
            } like icon`}
            onClick={Like_Handler}
          ></i> 
          )
          }
          {likeCount} likes
          <span className={"ml-1"}>
            {authContext.user?.username === username && (
             deleteLoading ? <img  alt={'loader'} width={"25px"} src={spinLoader} /> :<i className="trash icon" onClick={deletePostHandler}></i>
            )}
          </span>
        </span>
        <span onClick={Go_to_commentPage} style={{ cursor: "pointer" }}>
          {" "}
          <i className="comment icon"></i> {commentCount} comments
        </span>
      </div>
    </div>
  );
};

const Like_query = gql`
  mutation likePost($postId: String!) {
    likePost(postId: $postId) {
      likeCount
      Likes {
        username
      }
    }
  }
`;

const deletePost_query = gql`
  mutation ($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export default PostCard;
