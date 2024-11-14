import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import Nav from "./components/Nav";

function App() {
  const [user, setUser] = useState(null);
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    console.log('Token no App:', token);
    
    if (token) {
      // Garante que o token tem o prefixo 'Bearer '
      const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      // Configura header com o token
      const config = {
        headers: {
          'Authorization': bearerToken
        }
      };

      console.log('Config:', config);

      axios.get('user', config)
        .then(response => {
          console.log('Resposta do user:', response.data);
          setUser(response.data);
        })
        .catch(error => {
          console.log('Erro ao buscar user:', error.response?.data);
          setUser(null);
          localStorage.removeItem('jwt');
        });
    }
  }, [login]);

  return (
    <div className="App">
      <Router>
        <Nav user={user} setLogin={() => setLogin(false)} />
        <Routes>
          <Route path="/login" element={<Login setLogin={() => setLogin(true)} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset/:token" element={<Reset />} />
          <Route path="/" element={<Home user={user} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;