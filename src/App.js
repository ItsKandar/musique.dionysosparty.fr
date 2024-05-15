import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card, Nav } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Tracks from './Tracks';

const { CLIENT_ID, CLIENT_SECRET } = require('./secret');

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
  return (
    <Router>
      <div className="App">
        <Container>
          <Nav className="mb-3">
            <Nav.Item>
              <Nav.Link as={Link} to="/">Rechercher</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/tracks">Consulter la base de données</Nav.Link>
            </Nav.Item>
          </Nav>
        </Container>
        <Routes>
          <Route path="/" element={
            <Container>
              <InputGroup className="mb-3" size="lg">
                <FormControl
                  placeholder="Rechercher un titre"
                  type="input"
                  onKeyPress={event => {
                    if (event.key === "Enter"){
                      search();
                    }
                  }}
                  onChange={event => setSearchInput(event.target.value)}
                />
                <Button onClick={search}>
                  Rechercher
                </Button>
              </InputGroup>
              <Container>
                <Row className="mx-2 row row-cols-4">
                  {tracks.map((track, i) => {
                    console.log(track);
                    return (
                      <Card key={i}>
                        <Card.Img src={track.album.images[0].url} />
                        <Card.Body>
                          <Card.Title>{track.name}</Card.Title>
                          <Card.Text>
                            {track.artists[0].name} | {track.album.name}
                          </Card.Text>
                          <Button href={track.external_urls.spotify} target="_blank">
                            Ecouter
                          </Button>
                          <Button onClick={() => requestMusic(track)} class="btn btn-outline-success">
                            Demander l'ajout
                          </Button>
                        </Card.Body>
                      </Card>
                    )
                  })}
                </Row>
              </Container>
            </Container>
          } />
          <Route path="/tracks" element={<Tracks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;