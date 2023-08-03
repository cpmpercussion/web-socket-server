const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');

const uuid = require('uuid');  
const { timeStamp, log } = require('console');

const fs = require('fs');
const inquirer = require('inquirer');


const port = 3000;
const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server });
const sockets = {};

const HL19_ip = "::ffff:192.168.0.172";
const HL21_ip = "::ffff:192.168.0.253";
const minilab1 = "::ffff:192.168.0.132"
const minilab2 = "::ffff:192.168.0.81";

var laptop1 = minilab1;
var laptop2 = minilab2;
var hl1 = HL19_ip;
var hl2 = HL21_ip;

var filename;
var exp_con;


const questions = [
  {
    type: 'input',
    name: 'filename',
    message: "What's the filename for log?",
  },
  {
    type: 'input',
    name: 'expcon',
    message: "What's the current experiment condition?",
  },
];

inquirer.prompt(questions).then(answers => {
  console.log(answers.file);
  filename = answers.file;
  exp_con = answers.expcon;


});


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

  //create new file
  fs.open(filename, 'w', function (err, file) {
    if (err) throw err;
    console.log('Saved!');
  }); 


  ws.on('error', console.error);

  ws.on('message', function message (data) {

    if (exp_con == "rmi") {
          //RMI condition
    if (user_id == laptop1) {
          to(hl2, data)
    } 
    
    if (user_id == "::ffff:127.0.0.1") {
          to(hl1, data)
    }
    }else if (exp_con == "bmi") {
          //BMI condition
    if (user_id == hl2) {
      to(hl1, data)
    }else if (user_id == hl1) {
      to(hl2, data)
    }
    }else if (exp_con == "localtest"){
      to("::ffff:127.0.0.1", data)
    }else if (exp_con == "hltest"){
      to(hl1, data)
    }else if (exp_con == "dostest"){
      to("::ffff:192.168.0.216" ,data)
    }

    console.log(`Received message ${data} from user ${user_id}`);

    let timeStamp = new Date();
    content = `Message ${data} from user @ ${user_id} at @ ${timeStamp}`;
        fs.appendFile(filename.toString(), `${content}\n`, err => {
          if (err) {
            console.error(err);
          }

      });

  });

  ws.on('close', function() {
    console.log("client left.");
  });
});


server.listen(port, function() {
   console.log(`Listening on http://localhost:${port}`);
});



