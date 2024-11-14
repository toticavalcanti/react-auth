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
    
    if (token) {
      // Configura o token no axios para todas as requisições
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      axios.get('/api/user')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
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