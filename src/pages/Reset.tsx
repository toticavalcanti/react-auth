import React, { useState, SyntheticEvent } from "react";
import axios from "axios";
import { useParams, Navigate } from "react-router-dom";

const Reset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");
  const { token } = useParams<{ token: string }>();

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const apiBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
      const response = await axios.post(`${apiBaseUrl}/reset`, {
        token,
        password,
        confirm_password: confirmPassword
      });
      
      if (response.data?.message) {
        setRedirect(true);
      }
    } catch (err: any) {
      console.error("Error resetting password:", err);
      setError(err.response?.data?.message || "Failed to reset password");
    }
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <form className="form-floating" onSubmit={submit}>
      <h1 className="h3 mb-3 fw-normal">Reset Password</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="form-signin">
        <input
          type="password"
          className="form-control"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="form-signin">
        <input
          type="password"
          className="form-control"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <button className="form-signin btn btn-primary w-100 py-2" type="submit">
        Reset Password
      </button>

      <p className="mt-5 mb-3 text-body-secondary">&copy; 2024</p>
    </form>
  );
};

export default Reset;