import React, { useContext } from "react";
import { useHistory } from "react-router";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import useForm from "./useForm";
import { postInitialState } from "./Form/intialState";
import { FETCH_POSTS } from "./query/FETCH_POSTS";
import { AuthContext } from "../context/auth";
import spinLoader from '../spinLoader2.svg'
const PostForm = () => {
  const authContext = useContext(AuthContext);
  const history = useHistory();
  const { OnChange, formData } = useForm(postInitialState);
  const [createpost, { loading }] = useMutation(CREATE_POST, {
    update: (proxy, result) => {
      const data = proxy.readQuery({
        query: FETCH_POSTS,
      });
      const newData = [...data.getPosts,result.data.createPost];
      proxy.writeQuery({
        query: FETCH_POSTS,
        data: {
          ...data,
          getPosts: newData,
        },
      });
    },
    variables: formData,
    onError: (err) => {
      console.log("error", err);
    },
  });
  const submitHandler = () => {
    if (authContext.user == null) {
      return history.push("/register");
    }
    createpost();
  };
  return (
    <div className="ui card">
      <Form className="postForm">
        <Form.Field>
          <label>Create Post</label>
          <input placeholder="Post" onChange={OnChange} name={"body"} />
        </Form.Field>

     <Button type="submit" onClick={submitHandler} style={{height:"40px",width:"140px",marginTop:"10px"}}>
     {loading ? <img src={spinLoader} width={"20px"}  alt={'loader'}/> : "Create" }
        </Button>
      </Form>
    </div>
  );
};

// 1st variable define
// use variable

const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      body
      username
      id
      commentCount
      comments {
        username
        body
        createdAt
      }
      Likes {
        username
        createdAt
      }
      likeCount
      createdAt
    }
  }
`;

export default PostForm;
