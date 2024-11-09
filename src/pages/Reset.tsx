import React, { useState, SyntheticEvent } from 'react';
import axios from 'axios';
import { Navigate, useParams } from 'react-router-dom';

const getApiUrl = () => {
  return process.env.REACT_APP_API_URL || 'http://localhost:3000';
};

const Reset = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState('');
  const { token } = useParams<{ token: string }>();

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      await axios.post(`${getApiUrl()}/api/reset`, {
        token,
        password,
        confirm_password: confirmPassword,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      setRedirect(true);
    } catch (error: any) {
      // Tratamento de erro amigável para o usuário
      if (error.response) {
        setError(error.response.data.message || 'Failed to reset password');
      } else if (error.request) {
        setError('No response from server');
      } else {
        setError('Error during password reset');
      }

      // Log detalhado apenas em desenvolvimento
      if (process.env.REACT_APP_LOG_LEVEL === 'debug') {
        console.error('Reset password error:', error);
      }
    }
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <form className="form-floating" onSubmit={submit}>
      <h1 className="h3 mb-3 font-weight-normal">Reset your password</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="form-signin">
        <input
          type="password"
          className="form-control mb-3"
          placeholder="New Password"
          required
          onChange={e => setPassword(e.target.value)}
        />
      </div>

      <div className="form-signin">
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Confirm Password"
          required
          onChange={e => setConfirmPassword(e.target.value)}
        />
      </div>

      <button className="form-signin btn btn-primary w-100 py-2" type="submit">
        Reset Password
      </button>

      <p className="mt-5 mb-3 text-body-secondary">&copy; 2024</p>
    </form>
  );
};

export default Reset;