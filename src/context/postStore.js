import { createContext, useReducer } from "react";

const SAVE_POSTS = "SAVE_POST";
const initialState = {
  posts: null,
  commentOnpost :null
};

// creating context
// creating reducer

const PostContext = createContext(initialState);

function postReducer(state, action) {
  switch (action.type) {
    case SAVE_POSTS:
      return {
        ...state,
        posts: action.payload,
      };
    default:
      break;
  }
}

function PostProvider(props) {
  const [state, dispatch] = useReducer(postReducer, {
    posts: initialState.posts,
  });
   function updatePosts (data) {
       dispatch({
           type:SAVE_POSTS ,
           payload:data
       })
   }
  return <PostContext.Provider value={{ posts: state.posts, updatePosts , commentOnpost:state.commentOnpost }} {...props} />;
}

export { PostProvider ,PostContext}