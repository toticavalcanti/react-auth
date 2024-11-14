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
    (async () => {
      const token = localStorage.getItem('jwt');
      if (!token) {
        setUser(null);
        return;
      }

      try {
        // Mudança aqui: adicionado /api/ na URL e headers completos
        const response = await axios.get('/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setUser(response.data);
      } catch (e) {
        console.error("Error loading user data", e);
        setUser(null);
        localStorage.removeItem('jwt'); // Limpa o token se der erro
      }
    })();
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