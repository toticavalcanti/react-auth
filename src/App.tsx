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
    console.log('Base URL:', axios.defaults.baseURL);
    
    if (token) {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      axios.defaults.headers.common = headers;
      
      console.log('Fazendo requisição para:', `${axios.defaults.baseURL}/user`);
      console.log('Headers configurados:', headers);

      axios.get('/user', { headers })
        .then(response => {
          console.log('Resposta do user:', response.data);
          setUser(response.data);
        })
        .catch(error => {
          console.log('Erro ao buscar user:', error.response?.data || error);
          setUser(null);
          localStorage.removeItem('jwt');
          delete axios.defaults.headers.common['Authorization'];
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