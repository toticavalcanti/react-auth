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
    // Remove a configuração global anterior
    delete axios.defaults.headers.common['Authorization'];
    
    const token = localStorage.getItem('jwt');
    if (!token) {
      setUser(null);
      return;
    }

    // Configura o token
    const authHeader = `Bearer ${token}`;
    axios.defaults.headers.common['Authorization'] = authHeader;

    // Faz a requisição com o header explícito também
    axios.get('user', {
      headers: {
        'Authorization': authHeader
      }
    })
    .then(response => {
      setUser(response.data);
    })
    .catch(() => {
      setUser(null);
      localStorage.removeItem('jwt');
      delete axios.defaults.headers.common['Authorization'];
    });
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