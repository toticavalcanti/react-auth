import React, { useState, SyntheticEvent } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    // Os dados são passados como um objeto no segundo argumento da função post
    await axios.post("http://localhost:3000/api/login", {
      email: email,
      password: password,
    });
    console.log("Logged!")
    setRedirect(true);
  };

  if(redirect){
    return <Navigate to="/"/>;
  }
  return (
    <form className='form-floating' onSubmit={submit}>
      <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
      <div className="form-signin">
        <input type="email" className="form-control" placeholder="name@example.com" required 
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className="form-signin">
        <input type="password" className="form-control" placeholder="Password" required 
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <button className="form-signin btn btn-primary w-100 py-2" type="submit">Sign in</button>
      <p className="mt-5 mb-3 text-body-secondary">&copy; 2017–2024</p>
    </form>
  );
}
export default Login;