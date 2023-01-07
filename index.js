
// (async function() {
//const crypto = require('crypto');
const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');

const uuid = require('uuid');  
const { timeStamp } = require('console');

const app = express();
const port = 3000;

const server = createServer(app);
const wss = new WebSocket.Server({ server });
// const wss = new WebSocket('ws://localhost:3/ws');

// // Broadcast to all.
// wss.broadcast = function broadcast(data) {
//   wss.clients.forEach(function each(client) {
//     if ( client.readyState == WebSocket.OPEN && data != undefined ) 
//       client.send(data);
//   });
// };



wss.on('connection', function(ws) {
  console.log("client joined.");

  ws.id = uuid.v4();
  // console.log
  // send "hello world" interval
  // const textInterval = setInterval(() => ws.send("F"), 100);
  
  // wss.clients.forEach(function each(client) {
  //   console.log("Client id -> '" + client.id + "'");
  // })


  // send random bytes interval

  // const binaryInterval = setInterval(() => ws.send(crypto.randomBytes(8).buffer), 110);

  ws.on('message', function(data) {

    wss.clients.forEach(function each(client) {

      if ( client !== ws &&client.readyState === WebSocket.OPEN) {
        client.send(data);
        // client.send("  ");
        client.send(client.id);
        // console.log("string received from client -> '" + data +" /n " + client.id );
        // var d = new Date();
        // var time = d.toISOString();
        // console.log(new Date().toISOString());
        console.log("string received from client -> '" + data + "'");
        
      
      }
      // wss.broadcast(data);

    // if (client.readyState === WebSocket.OPEN) {
    //   console.log(client.id);
    //   console.log(client.data);

    // if (typeof(data) === "string") {
      // client sent a string
      
     

    // } else {
    //   console.log("binary received from client -> " + Array.from(data).join(", ") + "");
    // }
      // client.send(data);
  })


      // const notes = setInterval(() => ws.send(data), 110);

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

// app.listen(port, () => 
//     console.log(`Server running on port ${port}`)
// );
// })();