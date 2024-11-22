import React, { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import axios from "axios";

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
      await axios.post(`${process.env.REACT_APP_API_URL}/api/reset`, {
        token,
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
    <form onSubmit={handleSubmit}>
      <h1>Redefinir Senha</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="password"
        placeholder="Nova Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirme a Nova Senha"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Processando..." : "Redefinir Senha"}
      </button>
    </form>
  );
};

export default Reset;
