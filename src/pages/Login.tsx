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
    console.log('1. Iniciando login...');
    console.log('Base URL:', axios.defaults.baseURL);

    try {
      console.log('2. Fazendo requisição POST para /login');
      const response = await axios.post('login', {
        email,
        password
      });

      console.log('3. Resposta do login:', response.data);

      if (response.data?.jwt) {
        console.log('4. Token recebido:', response.data.jwt);
        localStorage.setItem('jwt', response.data.jwt);
        console.log('5. Token salvo no localStorage:', localStorage.getItem('jwt'));
        
        const headers = {
          'Authorization': `Bearer ${response.data.jwt}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        };
        
        axios.defaults.headers.common = headers;
        console.log('6. Token configurado no axios:', headers);
        
        setLogin(true);
        setRedirect(true);
      }
    } catch (error: any) {
      console.log('Erro durante login:', error);
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
    console.log('7. Redirecionando após login bem-sucedido');
    console.log('8. Headers do axios:', axios.defaults.headers.common);
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