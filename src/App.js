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
  const [searchInput, setSearchInput] = useState("basique");
  const [accessToken, setAccessToken] = useState("");
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    // API access token
    var authParamaters = {
      method : 'POST',
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }

    fetch('https://accounts.spotify.com/api/token', authParamaters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  }, [])

  // Sauvegarde de la musique dans la database
  async function requestMusic(music) {
    console.log("Demande d'ajout de la musique")
    console.log(music)
    const trackData = {
      id: music.id,
      name: music.name,
      artist: music.artists[0].name,
      album: music.album.name,
      url: music.external_urls.spotify,
      image: music.album.images[0].url
    };

    const response = await fetch('http://localhost:3001/api/tracks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trackData),
    });

    const data = await response.json();
    console.log(data);
  }

  // Recherche
  async function search() {
    console.log("Recherche de " + searchInput)

    // Prepare les parametres de la recherche
    var searchParameters = {
      method : 'GET',
      headers : {
        'Content-Type' : 'application/json',
        'Authorization' : 'Bearer ' + accessToken
      }
    }

    // Fait une GET Request pour recuperer les titres correspondant a la recherche
    var returnedTracks = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=track&market=FR&limit=50', searchParameters)
      .then(response => response.json())
      .then(data => { 
        console.log(data.tracks.items);
        setTracks(data.tracks.items);
       })
    // Affiche les titres
  }
  console.log(tracks);
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