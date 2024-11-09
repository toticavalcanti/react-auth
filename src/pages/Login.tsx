import React, { useState, SyntheticEvent } from 'react';
import axios from 'axios';
import { Navigate, Link } from 'react-router-dom';

// Função helper para obter URL da API
const getApiUrl = () => {
  return process.env.REACT_APP_API_URL || 'http://localhost:3000';
};

const Login: React.FC<{ setLogin: (loggedIn: boolean) => void }> = ({ setLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(''); // Adicionando estado para erro

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(''); // Limpa erro anterior

    try {
      const response = await axios.post(`${getApiUrl()}/api/login`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true // Importante para cookies
      });

      if (response.status === 200) {
        if (response.data.jwt) {
          // Armazena JWT apenas se necessário
          localStorage.setItem('jwt', response.data.jwt);
        }
        setLogin(true);
        setRedirect(true);
      }
    } catch (error: any) {
      // Tratamento de erro mais amigável
      if (error.response) {
        setError(error.response.data.message || 'Login failed');
      } else if (error.request) {
        setError('No response from server');
      } else {
        setError('Error during login');
      }

      // Log de erro em desenvolvimento
      if (process.env.REACT_APP_LOG_LEVEL === 'debug') {
        console.error('Login error:', error);
      }
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <form className='form-floating' onSubmit={submit}>
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
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <div className="form-signin">
        <input 
          type="password" 
          className="form-control" 
          placeholder="Password" 
          required 
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
}

export default Login;