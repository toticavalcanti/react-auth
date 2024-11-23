import React, { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import axios from "axios";

const getApiUrl = () => {
  return process.env.REACT_APP_API_URL || "http://localhost:8080";
};

const Reset = () => {
  const { token } = useParams(); // Captura o token da URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    try {
      // Envia o token, a nova senha e a confirmação da senha ao backend
      await axios.post(`${getApiUrl()}/api/reset`, {
        token, // O token capturado da URL
        password,
        confirm_password: confirmPassword,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao redefinir a senha.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <Navigate to="/login" />;
  }

  return (
    <form className="form-floating" onSubmit={handleSubmit}>
      <h1 className="h3 mb-3 fw-normal">Redefinir Senha</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="form-signin">
        <input
          type="password"
          className="form-control"
          placeholder="Nova Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="form-signin">
        <input
          type="password"
          className="form-control"
          placeholder="Confirme a Nova Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <button
        className="form-signin btn btn-primary w-100 py-2"
        type="submit"
        disabled={loading}
      >
        {loading ? "Processando..." : "Redefinir Senha"}
      </button>

      <p className="mt-5 mb-3 text-body-secondary">&copy; 2024</p>
    </form>
  );
};

export default Reset;
