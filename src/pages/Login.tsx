import React, { useState, SyntheticEvent } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    // Using an environment variable for the API URL
    const apiURL = process.env.REACT_APP_API_URL || "http://localhost:3000"; // Fallback to localhost if the environment variable is not set

    try {
      // Correction of the axios.post call with the URL and data as separate arguments
      const response = await axios.post(`${apiURL}/api/login`, {
        email, // Simplification, since the property name and variable name are the same
        password,
      });

      // Check the response here (example: if the login was successful based on the response status)
      if (response.status === 200) {
        console.log("Logged!")
        // If the response is successful, set the state to redirect
        setRedirect(true);
      } else {
        // Here, you can handle other status codes or set a state to display an error message
        console.error("Login failed with status:", response.status);
        // Ideally, you would set an error state here to inform the user that the login failed
      }
    } catch (error) {
      console.error("Error while logging in:", error);
      // Here, you could also set an error state to inform the user about the problem
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }
  return (
    <form className="form-floating" onSubmit={submit}>
      <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
      <div className="form-signin">
        <input
          type="email"
          className="form-control"
          placeholder="name@example.com"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-signin">
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="form-signin btn btn-primary w-100 py-2" type="submit">
        Sign in
      </button>
      <p className="mt-5 mb-3 text-body-secondary">&copy; 2017–2024</p>
    </form>
  );
};
export default Login;
