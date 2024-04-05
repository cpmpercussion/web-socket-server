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
const HL35_ip = "::ffff:192.168.0.50";
const HL36_ip = "::ffff:192.168.0.48";
const minilab1 = "::ffff:192.168.0.132";
const minilab2 = "::ffff:192.168.0.81";
const ethernet1 = "::ffff:192.168.0.19";
const ethernet2 = "::ffff:192.168.0.248";
const ethernet3 = "::ffff:192.168.0.249";
const charles_ai = "::ffff:192.168.0.81:5001";
// const charles = "::ffff:192.168.0.81";

var laptop1 = minilab1;
var laptop2 = minilab2; 
var hl1 = ethernet2;
var hl2 = ethernet3;
var hl3 = ethernet1;
var hl4 = ethernet2;

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
  filename = answers.filename;
  console.log(answers.filename);
  exp_con = answers.expcon;
  console.log(answers.expcon);


});

// optional routing logic function
function route_message (data) {
  // could put the routing logic in one spot
}

// todo - to set up a client connection to charles' genai_midi_module
const genai_ws = new WebSocket('ws://192.168.0.81:5001');

sockets[genai_ws.id] = ws; // add to the list of socket

genai_ws.on('open', function open() {
  genai_ws.send('/hello');
});

genai_ws.on('message', route_message); // could do it this way so that

// other option for your on('message' function.
genai_ws.on('message', function message(data) {
  // console.log('received: %s', data);
  // TODO: put the routing logic here.
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
  sockets[ws.id] = ws;
  // console.log(ws);

  //create new file
  fs.open(filename, 'w', function (err, file) {
    if (err) throw err;
    console.log('File created!');
  }); 

  ws.on('error', console.error);

  ws.on('message', function message (data) {
    console.log(data);
    // to(char, data);
    // to(hl3, data);
    if (fs == null) {
      fs.open(filename, 'w', function (err, file) {
        if (err) throw err;
        console.log('Open File!');
      }); 
    }
    if (exp_con == "rmi") {
          //RMI condition
      if (user_id == laptop1 ) {
            to(hl4, data)
      }else if (user_id == laptop2) {
            to(hl3, data)
      }
    
    }else if (exp_con == "bmi") {
          //BMI condition
    if (user_id == hl3) {
      to(hl4, data)
    }else if (user_id == hl4) {
      to(hl3, data)
    }
    }else if (exp_con == "localtest"){
      to("::ffff:127.0.0.1", data)
    }else if (exp_con == "hltest"){
      to(hl3, data)
    }else if (exp_con == "dostest"){
      to("::ffff:192.168.0.216" ,data)
    }else if  (exp_con == "duplex"){
    //console.log(data)
      if (user_id == laptop1) {
      to(hl4, data)
      }else if (user_id == laptop2) {
      to(hl3, data)
      }

      if (user_id == hl4) {
        to(hl3, data)
      }else if (user_id == hl3) {
        to(hl4, data)
      }

    }



// to(hl1, data)
    // to(hl2, data)
    // to("::ffff:192.168.0.216" ,data)
    //console.log(`Received message ${data} from user ${user_id}`);

    // let timeStamp = new Date();
    // content = `Message ${data} from user @ ${user_id} at @ ${timeStamp}`;
    //     fs.appendFile(filename.toString(), `${content}\n`, err => {
    //       if (err) {
    //         console.error(err);
    //       }

    //   });

  });

  ws.on('close', function() {
    console.log("client left.");
  });
});


server.listen(port, function() {
   console.log(`Listening on http://localhost:${port}`);
});



