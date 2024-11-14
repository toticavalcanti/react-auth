import React, { useState, SyntheticEvent } from "react";
import axios from "axios";
import { useParams, Navigate } from "react-router-dom";

const Reset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { token } = useParams<{ token: string }>();

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Envia o token e as novas senhas para o backend
      await axios.post("https://seu-backend.com/api/reset", {
        token,
        password,
        confirm_password: confirmPassword,
      });

      setRedirect(true); // Redireciona após sucesso
    } catch (err) {
      console.error("Error resetting password:", err);
      alert("Failed to reset password. Please try again.");
    }
  };

  if (redirect) {
    return <Navigate to="/login" />; // Redireciona para login após sucesso
  }

  return (
    <form onSubmit={submit}>
      <h1>Reset Password</h1>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default Reset;
