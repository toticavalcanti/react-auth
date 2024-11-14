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

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('/user')
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.error('Erro ao buscar usuário:', error.response?.data || error.message);
          setUser(null);
          localStorage.removeItem('jwt');
        });
    }
  }, []);

  return (
    <div className="App">
      <Router>
        <Nav user={user} />
        <Routes>
          <Route path="/login" element={<Login setLogin={(loggedIn: boolean) => setUser(loggedIn ? {} : null)} />} />
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
