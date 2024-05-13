import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import { useState, useEffect } from 'react';

const CLIENT_ID = "24efa9b185c84f3abe1630d3b53d01a2";
const CLIENT_SECRET = "0e906b9fd31e47d1a6e5f1c658fa7d67";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

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

  // Recherche
  async function search() {
    console.log("Recherche de " + searchInput)

    // Fait une GET Request pour recuperer l'Artist ID
    var searchParameters = {
      method : 'GET',
      headers : {
        'Content-Type' : 'application/json',
        'Authorization' : 'Bearer ' + accessToken
      }
    }
    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
      .then(response => response.json())
      .then(data => { return data.artists.items[0].id })

    console.log("ID de l'artiste : " + artistID)
    // Fait une GET Request avec l'Artist ID pour recuperer les albums de l'artiste
    var returnedAlbums= await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album,single&market=FR&limit=50', searchParameters)
      .then(response => response.json())
      .then(data => { 
        console.log(data);
        setAlbums(data.items);
       })
    // Affiche les albums de l'artiste
  }
  console.log(albums);
  return (
    <div className="App">
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Rechercher un artiste"
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
          {albums.map( (album, i) => {
            console.log(album);
            return (
              <Card>
                <Card.Img src={album.images[0].url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
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