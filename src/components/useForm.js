import { result } from "lodash";
import { useState, useEffect } from "react";
import { useHistory } from "react-router";
const useForm = (intialState = {}) => {
  const history = useHistory();
  const [success, setSuccess] = useState(undefined);
  const [formData, setFormData] = useState(intialState);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    success &&
      setTimeout(() => {
        history.push("/");
      }, 1000);
  }, [success]);

  const OnChange = (e) => {
    const name = e.target.name;

    switch (name) {
      case "username":
        return setFormData({ ...formData, username: e.target.value });
      case "password":
        return setFormData({ ...formData, password: e.target.value });
      case "email":
        return setFormData({ ...formData, email: e.target.value });
      case "confirmPassword":
        return setFormData({ ...formData, confirmPassword: e.target.value });
        case "body" :
          return setFormData({...formData ,body:e.target.value})
      default:
        return formData;
    }
  };

  const OnSucess = (message) => {
    setSuccess(message);
  };
  const OnError = (message) => {
    setError(message);
  };
  return {
    OnChange,
    formData,
    success,
    OnSucess,
    error,
    OnError,
  };
};
export default useForm;
