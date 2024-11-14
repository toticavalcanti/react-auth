import React, { useState, SyntheticEvent } from "react";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";

const Login: React.FC<{ setLogin: (loggedIn: boolean) => void }> = ({ setLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/login', { email, password });
      const token = response.data?.jwt;
      if (token) {
        localStorage.setItem('jwt', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setLogin(true);
        setRedirect(true);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Login failed. Try again.");
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={submit}>
      <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <input
        type="email"
        className="form-control"
        placeholder="Email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="form-control"
        placeholder="Password"
        required
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <div className="mb-3">
        <Link to="/forgot">Forgot Password?</Link>
      </div>
      <button className="btn btn-primary w-100 py-2" type="submit">Sign in</button>
    </form>
  );
};

export default Login;
