import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
// * Component
import Home from "./Route/Home";
import Register from "./Route/Register";
import Login from "./Route/Login";
import NotFound from "./Route/NotFound";
import Menubar from "./Menubar";
import ProtectedRoute from "./ProtectedRoute";
import Comment from './Route/Comments'
const SocialApp = () => {
 
const WrappedComponent = ({ Component , path}) => {
    return (
      <>
      <Route>
        <Menubar /> <Component/>
      </Route>
      </>
    );
  };

  return (
  
      <Router>
        <Switch>
          <Route exact path={"/"}>
            <WrappedComponent Component={Home} />
          </Route>
          <ProtectedRoute exact path={"/register"}>
            <WrappedComponent Component={Register} />
          </ProtectedRoute>
          <ProtectedRoute exact path={"/login"}>
            <WrappedComponent Component={Login} />
          </ProtectedRoute>
          <WrappedComponent path={"/:postId/comments"} Component={Comment}/>
          <Route path={"*"} component={NotFound} />
        </Switch>
      </Router>
  
  );
};

export default SocialApp;
