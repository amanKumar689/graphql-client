import React from "react";
import { AuthProvider } from "../context/auth";
import { PostProvider } from "../context/postStore";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "apollo-link-context";

// *  Importing Component
import SocialApp from "./SocialApp";

// *  -- >  Links
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});
const authLink = setContext(() => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token || ""}`,
    },
  };
});
// ? Creating client

const APOLLO_CLIENT = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

const ApolloConnect = () => {
  return (
    <ApolloProvider client={APOLLO_CLIENT}>
      <PostProvider>
        <AuthProvider>
          <SocialApp />
        </AuthProvider>
      </PostProvider>
    </ApolloProvider>
  );
};

export default ApolloConnect;
