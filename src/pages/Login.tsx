import React, { useState, SyntheticEvent, useEffect } from 'react';
import axios from 'axios';
import { Navigate, Link } from 'react-router-dom';

// Função helper para obter URL da API
const getApiUrl = () => {
 return process.env.REACT_APP_API_URL || 'http://localhost:3000';
};

// Configuração global do axios
axios.defaults.baseURL = getApiUrl();

// Interceptor para adicionar token em todas as requisições
axios.interceptors.request.use(function (config) {
 const token = localStorage.getItem('jwt');
 if (token) {
   config.headers.Authorization = `Bearer ${token}`;
 }
 return config;
});

const Login: React.FC<{ setLogin: (loggedIn: boolean) => void }> = ({ setLogin }) => {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [redirect, setRedirect] = useState(false);
 const [error, setError] = useState('');

 // Verifica se já tem token salvo
 useEffect(() => {
   const token = localStorage.getItem('jwt');
   if (token) {
     setLogin(true);
     setRedirect(true);
   }
 }, [setLogin]);

 const submit = async (e: SyntheticEvent) => {
   e.preventDefault();
   setError('');

   try {
     const response = await axios.post('/api/login', {
       email,
       password
     });

     if (response.status === 200 && response.data.jwt) {
       localStorage.setItem('jwt', response.data.jwt);
       // Atualiza o header do axios com o novo token
       axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.jwt}`;
       setLogin(true);
       setRedirect(true);
     }
   } catch (error: any) {
     if (error.response) {
       setError(error.response.data.message || 'Login failed');
     } else if (error.request) {
       setError('No response from server');
     } else {
       setError('Error during login');
     }

     if (process.env.REACT_APP_LOG_LEVEL === 'debug') {
       console.error('Login error:', error);
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
};

export default Login;