
// (async function() {
//const crypto = require('crypto');
const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');

const uuid = require('uuid');  
const { timeStamp, log } = require('console');

// const port = 3000;
const port = 3000;
const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server });

// // Broadcast to all.
// wss.broadcast = function broadcast(data) {
//   wss.clients.forEach(function each(client) {
//     if ( client.readyState == WebSocket.OPEN && data != undefined ) 
//       client.send(data);
//   });
// };
var id =0;
var lookup = {};

wss.on('connection', function(ws) {
  console.log("client joined.");


  // assign clients id and keep track of them.
  ws.id = id ++;
  lookup[ws.id] = ws;
  

  ws.on('error', console.error);


  // ws.id = uuid.v4();
  ws.on('message', function(data) {
    wss.clients.forEach(function each(client) {

      if ( client.readyState === WebSocket.OPEN && ws != client ) {
        client.send(data);
        console.log("string received from client -> '" + data +" /n " + client.id );
      }
  })
      
  });

  ws.on('close', function() {
    console.log("client left.");
    // clearInterval(textInterval);
    // clearInterval(binaryInterval);
  });
});


server.listen(port, function() {
   console.log(`Listening on http://localhost:${port}`);
});
