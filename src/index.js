import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

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
