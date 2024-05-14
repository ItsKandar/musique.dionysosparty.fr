import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import { useState, useEffect } from 'react';

const CLIENT_ID = "24efa9b185c84f3abe1630d3b53d01a2";
const CLIENT_SECRET = "0e906b9fd31e47d1a6e5f1c658fa7d67";

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

  // Demande d'ajout de musique
  async function requestMusic() {
    console.log("Demande d'ajout de la musique")
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
    <div className="App">
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Rechercher un titre"
            type="input"
            onKeyPress={event => {
              if (event.key == "Enter"){
                search();
              }
            }}
            onChange={event => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>
            Rechercher
          </Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className="mx-2 row row-cols-4">
          {tracks.map( (track, i) => {
            console.log(track);
            return (
              <Card>
                <Card.Img src={track.album.images[0].url} />
                <Card.Body>
                  <Card.Title>{track.name}</Card.Title>
                  <Card.Text>
                    {track.artists[0].name} | {track.album.name} 
                  </Card.Text>
                  <Button href={track.external_urls.spotify} target="_blank">
                    {/* ouvre la musique sur spotify ({track.external_urls.spotify}) */}
                    Ecouter
                  </Button>
                  {/* Bouton pour demander l'ajout dans la playlist */}
                  <Button onClick={requestMusic}>
                    Demander l'ajout
                  </Button>  
                </Card.Body>
              </Card>
            )
          })}
          
        </Row>
      </Container>
    </div>
  );
}

export default App;