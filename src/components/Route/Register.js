import React, { useState, useContext } from "react";
import { Form, Button, Message } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import _ from "lodash";
import useForm from "../useForm";
import { signupInitialState } from "../Form/intialState";
import { AuthContext } from "../../context/auth";
const Register = (props) => {
  const context = useContext(AuthContext);
  const { OnChange, formData, success, OnSucess, OnError, error } =
    useForm(signupInitialState);
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update: (proxy, result) => {
      OnSucess("successfully Sign up ");

      localStorage.setItem("token", result.data.register.token);
      const user = _.pick(result.data.register, ["username", "email"]);
      context.signup(user);
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
      <h1> Register </h1>
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
      <Form.Field error={error?.email}>
        <label>Email</label>
        <input
          auto
          autoComplete={"off"}
          placeholder="Email"
          type={"email"}
          name={"email"}
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
      <Form.Field error={error?.confirmPassword}>
        <label>confirm password</label>
        <input
          autoComplete={"off"}
          placeholder="confirm password"
          type={"password"}
          name={"confirmPassword"}
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

// ? Variable should be look like this TypeDef
// * Assign variable to property
const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      signUp: {
        username: $username
        password: $password
        confirmPassword: $confirmPassword
        email: $email
      }
    ) {
      username
      createdAt
      id
      email
      token
    }
  }
`;

export default Register;
