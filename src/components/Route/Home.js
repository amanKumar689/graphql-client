import React, { useContext, useEffect, useState } from "react";
import { Grid, Transition } from "semantic-ui-react";
import PostCard from "../PostCard";
import PostForm from "../PostForm";
import { PostContext } from "../../context/postStore";
// ? Let's show posts Here

const Home = () => {
  const Contextposts = useContext(PostContext).posts;
  const [posts, setPosts] = useState(Contextposts);

  useEffect(() => {
    setPosts(Contextposts);
  }, [Contextposts,posts]);


  return (
    <div className={"posts"}>
      <Grid columns={'equal'}  stackable  divided={'vertically'} >
        <Grid.Row>
          <Grid.Column  >
            <h1>Recent Posts</h1>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row  stretched>
          <Grid.Column   width={4}>
            <PostForm />
            
          </Grid.Column>

          {!posts ? (
            <h1 style={{ textAlign: "center", width: "100%" }}>Loading</h1>
          ) : (
            <Transition.Group>
              {posts.map((post, index) => (
                <Grid.Column tablet={8} computer={4} key={index}>
                  <PostCard {...post} />
                </Grid.Column>
              ))}
            </Transition.Group>
          )}
        </Grid.Row>
      </Grid>
    </div>
  );
};

// *  FETCH POSTS

export default Home;
