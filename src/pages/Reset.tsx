import React, { useState, SyntheticEvent } from "react";
import axios from "axios";
import { useParams, Navigate } from "react-router-dom";

const getApiUrl = () => {
  return process.env.REACT_APP_API_URL || "http://localhost:3000/api";
};

const Reset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Indicador de carregamento
  const { token } = useParams<{ token: string }>();

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const apiUrl = getApiUrl();
    console.log("Iniciando Reset de Senha");
    console.log("Token recebido via URL:", token);
    console.log("API Base URL:", apiUrl);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);

    // Validações
    if (!token) {
      console.error("Token inválido ou ausente!");
      setError("Invalid token. Please request a new password reset link.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      console.error("Senha muito curta! Mínimo de 6 caracteres.");
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      console.error("As senhas não conferem!");
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      console.log("Enviando requisição para:", `${apiUrl}/api/reset`);
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

      if (err.response) {
        console.error("Erro de Resposta do Servidor:", err.response.data);
        console.error("Status Code:", err.response.status);
        setError(err.response?.data?.message || "Failed to reset password");

        if (err.response?.data?.error) {
          console.error("Erro detalhado do backend:", err.response.data.error);
        }
      } else if (err.request) {
        console.error("Nenhuma resposta do servidor. Erro de requisição:", err.request);
        setError("No response from server.");
      } else {
        console.error("Erro inesperado:", err.message);
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (redirect) {
    console.log("Redirecionando para /login após sucesso.");
    return (
      <div>
        <p>Password reset successfully! Redirecting to login...</p>
        <Navigate to="/login" />
      </div>
    );
  }

  return (
    <form className="form-floating" onSubmit={submit}>
      <h1 className="h3 mb-3 fw-normal">Reset Password</h1>

      {loading && <div className="spinner">Loading...</div>}

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

      <button className="form-signin btn btn-primary w-100 py-2" type="submit" disabled={loading}>
        {loading ? "Processing..." : "Reset Password"}
      </button>

      <p className="mt-5 mb-3 text-body-secondary">&copy; 2024</p>
    </form>
  );
};

export default Reset;
