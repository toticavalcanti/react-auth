import React, { useState, SyntheticEvent } from 'react';
import axios from 'axios';
import { Navigate, Link } from 'react-router-dom';

const Login: React.FC<{ setLogin: (loggedIn: boolean) => void }> = ({ setLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('login', {
        email,
        password
      });

      if (response.status === 200 && response.data.jwt) {
        localStorage.setItem('jwt', response.data.jwt);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.jwt}`;
        setLogin(true);
        setRedirect(true);
      }
    } catch (error: any) {
      console.error('Erro completo:', error);
      localStorage.removeItem('jwt');
      delete axios.defaults.headers.common['Authorization'];

      if (error.response) {
        setError(error.response.data.message || 'Login failed');
      } else if (error.request) {
        setError('No response from server');
      } else {
        setError('Error during login');
      }
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <form className="form-floating" onSubmit={submit}>
      <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="form-signin">
        <input 
          type="email" 
          className="form-control" 
          placeholder="name@example.com" 
          required 
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <div className="form-signin">
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
      </div>

      <button className="form-signin btn btn-primary w-100 py-2" type="submit">
        Sign in
      </button>

      <p className="mt-5 mb-3 text-body-secondary">&copy; 2024</p>
    </form>
  );
};

export default Login;