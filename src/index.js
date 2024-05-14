var express = require('express');
var app = express();
var port = 4000;

app.get("/", async (req, res ) => {
  res.end(JSON.stringify({message: "Hello World"}));
} );

app.listen(port, () => {
  console.log("Server listening on port " + port);
  console.log( 'press CTRL+C to exit')
});
