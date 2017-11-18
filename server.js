'use strict';

const 
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json()); 

var r,e_cor; 

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

app.post('/webhook', (req, res) => {  
  let body = req.body;
  if (body.object === 'page') {
   body.entry.forEach(function(entry) {
    let webhook_event = entry.messaging[0];
    //console.log(webhook_event);
    let sender_psid = webhook_event.sender.id;
    //console.log('Sender PSID: ' + sender_psid);
     
    if (webhook_event.message) {
      handleMessage(sender_psid, webhook_event.message);        
    } else if (webhook_event.postback) {
      handlePostback(sender_psid, webhook_event.postback);
    }
  });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

app.get('/', (req, res) => {
  res.send('ola');
});

app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = "987654321";
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      //console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);      
    }
  }
});

function handleMessage(sender_psid, received_message) {
   let response;
   
  // Checks if the message contains text
  if (received_message.text) {    
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    
    /*request(  
      { url: 'https://mydream-ufpa-phi.herokuapp.com/sensor/e_cortina', 
       method: 'PUT', 
       json: {estado: "ligado"}
      }, 
      function(error, request, body){
      console.log(body)});*/
    
    
/*request(  { 
  url: 'https://mydream-ufpa-phi.herokuapp.com/sensor/e_cortina', 
  method: 'GET', 
  }, 
  function(error, request, body){
    r = body.substring(1, body.length - 1);
  response = {
      "text": "carregando resposta"
    } 
  });
    
    console.log(r);
    if(r === 'desligado'){
       response = {
      "text": "desligado"
    }
    }else{
      response = {"text": "ligado"
    } 
    }*/
  
       
       response = {
      "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
    }
    
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
  } 
  
  // Send the response message
  callSendAPI(sender_psid, response);  
}

function handlePostback(sender_psid, received_postback) {
  let response;
  
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
   // Construct the message body
  
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      //console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}
