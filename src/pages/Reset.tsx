import React, { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import axios from "axios";

const Reset = () => {
  const { token } = useParams<{ token: string }>(); // Captura o token da URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validações
    if (!token) {
      setError("Token inválido ou ausente.");
      setLoading(false);
      return;
    }

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
      // Envia a requisição para a API
      await axios.post(`${process.env.REACT_APP_API_URL}/api/reset`, {
        token,
        password,
        confirm_password: confirmPassword,
      });

      setSuccess(true);
    } catch (err: any) {
      // Trata erros da requisição
      setError(err.response?.data?.message || "Erro ao redefinir a senha.");
    } finally {
      setLoading(false);
    }
  };

  // Redireciona para a página de login após o sucesso
  if (success) {
    return <Navigate to="/login" />;
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h1>Redefinir Senha</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="password"
          placeholder="Nova Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="password"
          placeholder="Confirme a Nova Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Processando..." : "Redefinir Senha"}
      </button>
    </form>
  );
};

export default Reset;
