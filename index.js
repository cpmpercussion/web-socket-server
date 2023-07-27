const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');

const uuid = require('uuid');  
const { timeStamp, log } = require('console');

const port = 3000;
const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server });
const sockets = {};

const HL19_ip = "::ffff:192.168.0.172";
const HL21_ip = "::ffff:192.168.0.253";
const minilab1 = "::ffff:192.168.0.132"
const minilab2 = "::ffff:192.168.0.56";

var laptop1 = minilab1;
var laptop2 = minilab2;
var hl1 = HL19_ip;
var hl2 = HL21_ip

// thanks to https://stackoverflow.com/questions/51316727/how-do-i-send-a-message-to-a-specific-user-in-ws-library.
function to(user, data) {
    if(sockets[user] && sockets[user].readyState === WebSocket.OPEN)
        sockets[user].send(data);
}

wss.on('connection', function(ws, request, client) {
  console.log("client joined.");
  const user_id = request.socket.remoteAddress;
  ws.id = user_id;
  sockets[ws.id] = ws


  ws.on('error', console.error);

  ws.on('message', function message (data) {


    if (user_id == laptop1) {
          to(hl1, data)
    }else if (user_id == laptop2) {
          to(hl2, data)
    }

    console.log(`Received message ${data} from user ${user_id}`);

      
  });

  ws.on('close', function() {
    console.log("client left.");
  });
});


server.listen(port, function() {
   console.log(`Listening on http://localhost:${port}`);
});
