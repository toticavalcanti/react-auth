import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import Nav from "./components/Nav";

interface User {
 id: number;
 first_name: string;
 last_name: string;
 email: string;
}

function App() {
 const [user, setUser] = useState<User | null>(null);
 const [login, setLogin] = useState(false);

 // Configuração global do axios
 axios.defaults.withCredentials = true;
 const apiBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

 useEffect(() => {
   const token = localStorage.getItem("jwt");

   if (token) {
     const config = {
       headers: {
         Authorization: `Bearer ${token}`,
         Accept: "*/*",
         "Content-Type": "application/json",
       },
     };

     axios
       .get(`${apiBaseUrl}/api/user`, config)
       .then((response) => {
         setUser(response.data);
       })
       .catch((error) => {
         console.error("Erro ao buscar o usuário:", error);
         setUser(null);
         localStorage.removeItem("jwt");
       });
   }
 }, [login, apiBaseUrl]);

 return (
   <div className="App">
     <HashRouter>
       <Nav user={user} setLogin={() => setLogin(false)} />
       <Routes>
         <Route path="/" element={<Home user={user} />} />
         <Route path="/login" element={<Login setLogin={() => setLogin(true)} />} />
         <Route path="/register" element={<Register />} />
         <Route path="/forgot" element={<Forgot />} />
         <Route path="/reset/:token" element={<Reset />} />
         <Route path="*" element={<Navigate to="/" replace />} />
       </Routes>
     </HashRouter>
   </div>
 );
}

export default App;