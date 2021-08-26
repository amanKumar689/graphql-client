import React, { useState, useContext } from "react";
import { Form, Button, Message } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import _ from "lodash";
import { loginInitialState } from "../Form/intialState";
import useForm from "../useForm";
import { AuthContext } from "../../context/auth";
const Login = (props) => {
  const context = useContext(AuthContext);
  const { OnChange, formData, success, OnSucess, OnError, error } =
    useForm(loginInitialState);
  const [addUser, { loading }] = useMutation(LOGIN_USER, {
    update: (proxy, result) => {
      localStorage.setItem("token", result.data.login.token);
      const user = _.pick(result.data.login, ["username", "email"]);
      context.login(user);
      OnSucess("successfully Signed Up");
    },
    onError: (err) => {
      OnError(err.graphQLErrors[0]?.extensions.errors);
    },
    variables: formData,
  });

  function formHandler() {
    OnError(undefined);
    addUser();
  }

  return (
    <Form error success className={loading && "loading"}>
      <h1> Login </h1>
      <br />
      <Form.Field error={error?.username}>
        <label>Username</label>
        <input
          autoComplete={"off"}
          placeholder="Username"
          type={"text"}
          name={"username"}
          onChange={OnChange}
        />
      </Form.Field>

      <Form.Field error={error?.password}>
        <label>password</label>
        <input
          autoComplete={"off"}
          placeholder="password"
          type={"password"}
          name={"password"}
          onChange={OnChange}
        />
      </Form.Field>

      <Button type="submit" onClick={formHandler}>
        Submit
      </Button>

      {success && <Message success header={""} content={success} />}
      {error &&
        Object.keys(error).map((key) => (
          <li style={{ color: "red", marginTop: "10px" }}> {error[key]}</li>
        ))}
    </Form>
  );
};

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      token
      id
      email
    }
  }
`;

export default Login;
