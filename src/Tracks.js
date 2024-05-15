import React, { useState, useEffect } from 'react';
import { Container, Row, Card, Button } from 'react-bootstrap';

function Tracks() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/tracks')
      .then(response => response.json())
      .then(data => setTracks(data.tracks));
  }, []);

  async function approveMusic(track) {
    console.log("Approuver la musique")
    console.log(track)
    const response = await fetch('http://localhost:3001/api/approve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(track),
    });

    const data = await response.json();
    console.log(data);
  }

    async function rejectMusic(track) {
    console.log("Refuser la musique")
    console.log(track)
    const response = await fetch('http://localhost:3001/api/reject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(track),
    });

    const data = await response.json();
    console.log(data);
    }

  return (
    <Container>
        <Row className="mx-2 row row-cols-4">
            {tracks.map((track, i) => {
                console.log(track);
                return (
            <Card key={i} className="mb-3">
                <Card.Img src={track.image} />
                <Card.Body>
                    <Card.Title>{track.name}</Card.Title>
                    <Card.Text>
                        {track.artist} | {track.album}
                    </Card.Text>
                    <Card.Text>
                        {track.status}
                    </Card.Text>
                    <Button href={track.url} target="_blank" class="btn btn-outline-primary">
                        Écouter
                    </Button>
                    <Button class="btn btn-outline-success" onClick={() => approveMusic(track)}>
                        Approuver
                    </Button> 
                    <Button class="btn btn-outline-danger" onClick={() => rejectMusic(track)}>
                        Refuser
                    </Button> 
                </Card.Body>
            </Card>
            )
            })}
        </Row>
    </Container>
  );
}

export default Tracks;