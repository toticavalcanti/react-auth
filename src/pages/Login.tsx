import React, { useState, SyntheticEvent } from 'react';
import axios from 'axios';
import { Navigate, Link } from 'react-router-dom';

// Função helper para obter URL da API
const getApiUrl = () => {
  return process.env.REACT_APP_API_URL || 'http://localhost:3000';
};

// Configuração global do axios
axios.defaults.baseURL = getApiUrl();
axios.defaults.withCredentials = true;  // Importante para cookies/sessões

// Interceptor para adicionar token em todas as requisições
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('jwt');
  if (token && config.headers) {  // Garantindo que headers existe
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

const Login: React.FC<{ setLogin: (loggedIn: boolean) => void }> = ({ setLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Primeiro: fazer login e obter token
      const loginResponse = await axios.post('/login', {
        email,
        password
      });

      if (loginResponse.status === 200 && loginResponse.data.jwt) {
        // Salvar token
        const token = loginResponse.data.jwt;
        localStorage.setItem('jwt', token);
        
        // Configurar token nos headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Verificar se a autenticação funcionou buscando dados do usuário
        try {
          await axios.get('/user');
          // Se chegou aqui, a autenticação está ok
          setLogin(true);
          setRedirect(true);
        } catch (userError) {
          console.error('Erro ao buscar usuário:', userError);
          setError('Erro ao verificar autenticação');
          localStorage.removeItem('jwt');
          setLogin(false);
        }
      }
    } catch (error: any) {
      console.error('Erro completo:', error);
      localStorage.removeItem('jwt');
      
      if (error.response) {
        setError(error.response.data.message || 'Falha no login');
      } else if (error.request) {
        setError('Sem resposta do servidor');
      } else {
        setError('Erro durante o login');
      }
      
      setLogin(false);
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