import React from 'react';

const Login: React.FC = () => {
  return (
    <form className='form-floating'>
      <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
      <div className="form-signin">
        <input type="email" className="form-control" placeholder="name@example.com" required />
      </div>
      <div className="form-signin">
        <input type="password" className="form-control" placeholder="Password" required />
      </div>
      <button className="form-signin btn btn-primary w-100 py-2" type="submit">Sign in</button>
      <p className="mt-5 mb-3 text-body-secondary">&copy; 2017–2024</p>
    </form>
  );
}
export default Login;