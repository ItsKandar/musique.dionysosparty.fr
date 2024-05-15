import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card, Nav } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { BrowserRouter as BrowserRouter, Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import Search from './Search';
import Tracks from './Tracks';
import Register from './Register';
import Login from './Login';

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App