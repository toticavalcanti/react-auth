import React, { useState, SyntheticEvent } from "react";
import axios from "axios";
import { useParams, Navigate } from "react-router-dom";

const getApiUrl = () => {
  return process.env.REACT_APP_API_URL || "http://localhost:3000";
};

const Reset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");
  const { token } = useParams<{ token: string }>();

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(""); // Reset any previous error

    const apiUrl = getApiUrl();
    console.log("Iniciando Reset de Senha");
    console.log("Token recebido via URL:", token);
    console.log("API Base URL:", apiUrl);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);

    // Verifica se as senhas correspondem
    if (password !== confirmPassword) {
      console.error("As senhas não conferem!");
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/reset`,
        {
          token,
          password,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Resposta do Servidor:", response.data);

      if (response.data?.message) {
        console.log("Reset de senha realizado com sucesso!");
        setRedirect(true);
      }
    } catch (err: any) {
      console.error("Erro ao realizar o Reset:", err);

      // Erro de resposta do servidor
      if (err.response) {
        console.error("Erro de Resposta do Servidor:", err.response.data);
        console.error("Status Code:", err.response.status);
        setError(err.response?.data?.message || "Failed to reset password");
      }
      // Erro de requisição
      else if (err.request) {
        console.error("Nenhuma resposta do servidor. Erro de requisição:", err.request);
        setError("No response from server.");
      }
      // Outro erro
      else {
        console.error("Erro durante a requisição:", err.message);
        setError("An unexpected error occurred.");
      }
    }
  };

  if (redirect) {
    console.log("Redirecionando para /login após sucesso.");
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
