import React, { useState, SyntheticEvent } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const getApiUrl = () => {
  return process.env.REACT_APP_API_URL || 'http://localhost:3000';
};

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${getApiUrl()}/api/register`, {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        confirm_password: confirmPassword,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      if (response.status === 200) {
        setRedirect(true);
      }
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.message || 'Registration failed');
      } else if (error.request) {
        setError('No response from server');
      } else {
        setError('Error during registration');
      }

      // Log detalhado apenas em desenvolvimento
      if (process.env.REACT_APP_LOG_LEVEL === 'debug') {
        console.error('Registration error:', error);
      }
    }
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <form className='form-floating' onSubmit={submit}>
      <h1 className="h3 mb-3 fw-normal">Please register</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="form-signin">
        <input 
          className="form-control" 
          placeholder="First Name" 
          required 
          onChange={e => setFirstName(e.target.value)}
        />
      </div>

      <div className="form-signin">
        <input 
          className="form-control" 
          placeholder="Last Name" 
          required 
          onChange={e => setLastName(e.target.value)}
        />
      </div>

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
      </div>

      <div className="form-signin">
        <input 
          type="password" 
          className="form-control" 
          placeholder="Confirm Password" 
          required 
          onChange={e => setConfirmPassword(e.target.value)}
        />
      </div>

      <button className="form-signin btn btn-primary w-100 py-2" type="submit">
        Register
      </button>

      <p className="mt-5 mb-3 text-body-secondary">&copy; 2024</p>
    </form>
  );
};

export default Register;