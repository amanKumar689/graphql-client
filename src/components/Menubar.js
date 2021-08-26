import React, { useContext ,useEffect } from "react";
import { Menu, Segment } from "semantic-ui-react";
import createHistory from "history/createBrowserHistory";
import { Link } from "react-router-dom";
import "../app.css";
import { AuthContext } from "../context/auth";
import { PostContext } from "../context/postStore";
import { useQuery } from "@apollo/client";
import { FETCH_POSTS } from "./query/FETCH_POSTS";
const Menubar = () => {
  const authContext = useContext(AuthContext);
  const pathName = createHistory().location.pathname.split("/")[1];
  const { loading, data: { getPosts:posts} = {} } = useQuery(FETCH_POSTS); // i think it listen for changes...
  const postContext = useContext(PostContext)

  useEffect(()=>{
    postContext.updatePosts(posts?.slice().reverse())
  },[posts])
  return (
    <div>
      <Segment inverted>
        <Menu inverted className={"Menu"}>
          <section>
            <Menu.Item
              name={"home"}
              active={pathName === ""}
              as={Link}
              to={"/"}
            />
          </section>
          {authContext.user == null ? (
            <section>
              <Menu.Item
                name={"Register"}
                active={pathName === "register"}
                as={Link}
                to={"register"}
              />
              <Menu.Item
                name={"Log In"}
                active={pathName === "login"}
                as={Link}
                to={"login"}
              />
            </section>
          ) : (
            <section>
              <Menu.Item name={"logout"} onClick={authContext.logout} />
            </section>
          )}
        </Menu>
      </Segment>
    </div>
  );
};


export default Menubar;
