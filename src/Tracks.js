import React, { useState, useEffect } from 'react';
import { Container, Row, Card, Button } from 'react-bootstrap';

function Tracks() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/tracks')
      .then(response => response.json())
      .then(data => setTracks(data.tracks));
  }, []);

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
                    <Button href={track.url} target="_blank">
                        Écouter
                    </Button>
                    <Button class="btn btn-success">
                        Approuver
                    </Button> 
                    <Button class="btn btn-danger">
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