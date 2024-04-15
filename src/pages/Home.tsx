import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home: React.FC = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('user');
        const user = response.data;
        setMessage(`Hi ${user.first_name} ${user.last_name}`);
      } catch (e) {
        setMessage('You are not logged in!');
      }
    })();
  }, []);
  return (
    <div className="container">
      <h1>{message}</h1>
    </div>
  );
}

export default Home;