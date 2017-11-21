'use strict';

const 
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json()); 

var r,e_cor; 

//-------------------linguagem coloquial-----------------------------
var flag, flag2, acende, apaga, objeto, situacao, uso, modo = 0;
	
var lamp1 = ["central", "lampada", "principal", "luz"];
var lamp2 = ["abajur", "secundario"];
var arduino = ["arduino", "controle"];
var celular = ["celular", "mobile", "controle"]
var tranca = ["tranca", "porta", "trancar"];
var som = ["som", "alarme"];
var ventilador = ["vento", "ventilador"];
var janela = ["janela"];
var cortina = ["cortina", "persiana"];

var usar = ["usar", "utilizar", "usando"]
var estados = ["estado", "estados", "situação", "situacao"];
var on = ["acende", "liga", "ligar", "aumenta", "abrir", "abre"];
var off = ["apaga", "desliga", "desligar", "diminui", "fechar", "fecha"];

var econtrole, etranca, ealarme, eventilador, elampada, eabajur, ejanela, ecortina = '';
//--------------------------------------------------------------------

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
   
   getAll();

  if (received_message.text) {    
	var frase = received_message.text;
	var palavras = frase.split(" ");

	//----------on e off ou estado--------------------
	
	for (var i = 0; i < on.length; i++) {
		for (var j = 0; j < palavras.length; j++) {
			if(on[i].toLowerCase() == palavras[j].toLowerCase() && !flag){
				acende = 1;
				flag = 1;
			}
		}
	}

	for (var i = 0; i < off.length; i++) {
		for (var j = 0; j < palavras.length; j++) {
			if(off[i].toLowerCase() == palavras[j].toLowerCase() && !flag){
				apaga = 1;
				flag = 1;
			}
		}
	}

	for (var i = 0; i < usar.length; i++) {
		for (var j = 0; j < palavras.length; j++) {
			if(usar[i].toLowerCase() == palavras[j].toLowerCase() && !flag){
				uso = 1;
				flag = 1;
			}
		}
	}

	for (var i = 0; i < estados.length; i++) {
		for (var j = 0; j < palavras.length; j++) {
			if(estados[i].toLowerCase() == palavras[j].toLowerCase() && !flag){
				situacao = 1;
				flag = 1;
			}
		}
	}

	//----------qual objeto-----------------------
	
	for (var i = 0; i < arduino.length; i++) {
		for (var j = 0; j < palavras.length; j++) {
			if(arduino[i].toLowerCase() == palavras[j].toLowerCase() && !flag2){
				objeto = 1;
				modo = 1;
				flag2 = 1;
			}
		}
	}

	for (var i = 0; i < celular.length; i++) {
		for (var j = 0; j < palavras.length; j++) {
			if(celular[i].toLowerCase() == palavras[j].toLowerCase() && !flag2){
				objeto = 1;
				modo = 2;
				flag2 = 1;
			}
		}
	}

	for (var i = 0; i < tranca.length; i++) {
		for (var j = 0; j < palavras.length; j++) {
			if(tranca[i].toLowerCase() == palavras[j].toLowerCase() && !flag2){
				objeto = 2;
				flag2 = 1;
			}
		}
	}

	for (var i = 0; i < som.length; i++) {
		for (var j = 0; j < palavras.length; j++) {
			if(som[i].toLowerCase() == palavras[j].toLowerCase() && !flag2){
				objeto = 3;
				flag2 = 1;
			}
		}
	}

	for (var i = 0; i < ventilador.length; i++) {
		for (var j = 0; j < palavras.length; j++) {
			if(ventilador[i].toLowerCase() == palavras[j].toLowerCase() && !flag2){
				objeto = 4;
				flag2 = 1;
			}
		}
	}

	for (var i = 0; i < lamp1.length; i++) {
		for (var j = 0; j < palavras.length; j++) {
			if(lamp1[i].toLowerCase() == palavras[j].toLowerCase() && !flag2){
				objeto = 5;
				flag2 = 1;
			}
		}
	}

	for (var i = 0; i < lamp2.length; i++) {
		for (var j = 0; j < palavras.length; j++) {
			if(lamp2[i].toLowerCase() == palavras[j].toLowerCase() && !flag2){
				objeto = 6;
				flag2 = 1;
			}
		}
	}

	for (var i = 0; i < janela.length; i++) {
		for (var j = 0; j < palavras.length; j++) {
			if(janela[i].toLowerCase() == palavras[j].toLowerCase() && !flag2){
				objeto = 7;
				flag2 = 1;
			}
		}
	}

	for (var i = 0; i < cortina.length; i++) {
		for (var j = 0; j < palavras.length; j++) {
			if(cortina[i].toLowerCase() == palavras[j].toLowerCase() && !flag2){
				objeto = 8;
				flag2 = 1;
			}
		}
	}

	//-------------oq fazer---------------

	if(acende){
		if(objeto == 1){
			if(modo == 1){
				response = {"text": `Controlando o sistema de acordo com o ambiente`}
				getAll();
				putRequest("desligado", "celular"); objeto = 0;
			}else if(modo == 2){
				response = {"text": `Controlando o sistema pelo celular`}
				getAll();
				putRequest("ligado", "celular"); objeto = 0;
			}        
		}else if(objeto == 2){
			response = {"text": `Tranca aberta`}  
			getAll(); objeto = 0;
			putRequest("ligado", "e_tranca");           
		}else if(objeto == 3){
			response = {"text": `Alarme ligado`} 
			getAll();objeto = 0;
			putRequest("ligado", "alarme");              
		}else if(objeto == 4){
			response = {"text": `Ventilador ligado`}
			getAll();objeto = 0;
			putRequest("ligado", "e_vent");               
		}else if(objeto == 5){
			response = {"text": `Lâmpada ligada`}    
			getAll();objeto = 0;
			putRequest("ligado", "e_lamp1");      
		}else if(objeto == 6){
			response = {"text": `Abajur ligado`}   
			getAll();objeto = 0;
			putRequest("ligado", "e_lamp2");          
		}else if(objeto == 7){
			response = {"text": `Janela aberta`}   
			getAll();objeto = 0;
			putRequest("ligado", "e_janela");            
		}else if(objeto == 8){
			response = {"text": `Cortina aberta`} 
			getAll();objeto = 0;
			putRequest("ligado", "e_cortina");             
		}else{
			response = {"text": `Não entendi qual objeto você deseja ligar, pode repetir sua frase mais explicitamente`}
			getAll();objeto = 0;
		}
	}else if(apaga){
		if(objeto == 1){
			if(modo == 2){
				response = {"text": `Controlando o sistema de acordo com o ambiente`}
				getAll();
				putRequest("desligado", "celular"); objeto = 0;
			}else if(modo == 1){
				response = {"text": `Controlando o sistema pelo celular`}
				getAll();
				putRequest("ligado", "celular"); objeto = 0;
			}  
		}else if(objeto == 2){
			response = {"text": `Tranca fechada`}
			getAll();objeto = 0;
			putRequest("desligado", "e_tranca");  
		}else if(objeto == 3){
			response = {"text": `Alarme desligado`}  
			getAll();        objeto = 0;
			putRequest("desligado", "alarme");
		}else if(objeto == 4){
			response = {"text": `Ventilador desligado`}
			getAll();objeto = 0;
			putRequest("desligado", "e_vent");        
		}else if(objeto == 5){
			response = {"text": `Lâmpada desligada`}  
			getAll();  objeto = 0;
			putRequest("desligado", "e_lamp1");
		}else if(objeto == 6){
			response = {"text": `Abajur desligado`} 
			getAll();objeto = 0;
			putRequest("desligado", "e_lamp2");      
		}else if(objeto == 7){
			response = {"text": `Janela fechada`}
			getAll();objeto = 0;
			putRequest("desligado", "e_janela");        
		}else if(objeto == 8){
			response = {"text": `Cortina fechada`}
			getAll();objeto = 0;
			putRequest("desligado", "e_cortina");          
		}else{
			response = {"text": `Não entendi qual objeto você deseja apagar, pode repetir sua frase mais explicitamente`}
			getAll();objeto = 0;
		}
	}else if(situacao){
		if(objeto == 1){
			getAll();objeto = 0;
			if(econtrole == "ligado"){
				response = {"text": `O sistema está sendo controlado de acordo com o ambiente`}
			}else{
				response = {"text": `O sistema está sendo controlado pelo celular`}
			}
		}else if(objeto == 2){
			getAll();objeto = 0;
			if(etranca == "ligado"){
				response = {"text": `A tranca está aberta`}
			}else{
				response = {"text": `A tranca está fechada`}
			}
		}else if(objeto == 3){
			getAll();objeto = 0;
			if(ealarme == "ligado"){
				response = {"text": `O alarme está ligado`}
			}else{
				response = {"text": `O alarme está desligado`}
			}          
		}else if(objeto == 4){
			getAll();objeto = 0;
			if(eventilador == "ligado"){
				response = {"text": `O ventilador está ligado`}
			}else{
				response = {"text": `O ventilador está desligado`}
			}      
		}else if(objeto == 5){
			getAll();objeto = 0;
			if(elampada == "ligado"){
				response = {"text": `A lâmpada está ligada`}
			}else{
				response = {"text": `A lâmpada está desligada`}
			}
		}else if(objeto == 6){
			getAll();objeto = 0;
			if(eabajur == "ligado"){
				response = {"text": `O abajur está ligado`}
			}else{
				response = {"text": `O abajur está desligado`}
			}        
		}else if(objeto == 7){
			getAll();objeto = 0;
			if(ejanela == "ligado"){
				response = {"text": `A janela está aberta`}
			}else{
				response = {"text": `A janela está fechada`}
			}          
		}else if(objeto == 8){
			getAll();objeto = 0;
			if(ecortina == "ligado"){
				response = {"text": `A cortina está aberta`}
			}else{
				response = {"text": `A cortina está fechada`}
			}        
		}else{
			getAll();objeto = 0;
			var resposta = "O sistema está sendo controlado ";
			if(econtrole == "ligado"){
				resposta += "de acordo com o ambiente, ";
			}else{
				resposta += "pelo celular, ";
			}
			if(etranca == "ligado"){
				resposta += "com a tranca aberta, ";
			}else{
				resposta += "com a tranca fechada, ";
			}
			if(ealarme == "ligado"){
				resposta += "o alarme ligado, ";
			}else{
				resposta += "o alarme desligado, ";
			}
			if(eventilador == "ligado"){
				resposta += "o ventilador ligado, ";
			}else{
				resposta += "o ventilador desligado, ";
			}
			if(elampada == "ligado"){
				resposta += "a lampada ligada, ";
			}else{
				resposta += "a lampada desligada, ";
			}
			if(eabajur == "ligado"){
				resposta += "o abajur ligado, ";
			}else{
				resposta += "o abajur desligado, ";
			}
			if(ejanela == "ligado"){
				resposta += "a janela aberta e ";
			}else{
				resposta += "a janela fechada e ";
			}
			if(ecortina == "ligado"){
				resposta += "a cortina aberta.";
			}else{
				resposta += "a cortina fechada.";
			}
			response = {"text": resposta}
		}
	}else if(uso){
		if(modo == 1){
			response = {"text": `Controlando o sistema de acordo com o ambiente`}
			getAll();
			putRequest("desligado", "celular"); objeto = 0;
		}else if(modo == 2){
			response = {"text": `Controlando o sistema pelo celular`}
			getAll();
			putRequest("ligado", "celular"); objeto = 0;
		}else{
			response = {"text": `Não entendi por onde você quer controlar o sistema, por favor repita mais explicitamente`}
			getAll();objeto = 0;
		}
	}else{
		response = {"text": `Não entendi o que você quer fazer, por favor repita mais explicitamente`}
		getAll();
		objeto = 0;
	}

	flag2 = 0;      //para nao repetir as ações
	flag = 0;      //para nao repetir os componentes
	acende = 0;    //quando for acender algo
	apaga = 0;    //quando for desligar algo
	situacao = 0; //situaçao dos componentes
	uso = 0;     //se a palavra central for uso
    modo = 0;    //modo em q o sistema eh controlado, celular ou arduino
  } //fecha o if laaaaaa de cima
  
  callSendAPI(sender_psid, response);  
}

function handlePostback(sender_psid, received_postback) {
  let response;
  let payload = received_postback.payload;

  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }

  callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

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

function putRequest(estado, sensor){
	request(  
      { url: 'https://mydream-ufpa-phi.herokuapp.com/sensor/' + sensor, 
       method: 'PUT', 
       json: {estado: estado}
      }, 
      function(error, request, body){});	
}

function getAll(){
	request(  { 
  		url: 'https://mydream-ufpa-phi.herokuapp.com/sensor/celular', 
  		method: 'GET', 
  	}, 
  	function(error, request, body){
    	r = body.substring(1, body.length - 1);
  		econtrole = r;
  	});

  	request(  { 
  		url: 'https://mydream-ufpa-phi.herokuapp.com/sensor/e_tranca', 
  		method: 'GET', 
  	}, 
  	function(error, request, body){
    	r = body.substring(1, body.length - 1);
  		ealarme = r;
  	});

  	request(  { 
  		url: 'https://mydream-ufpa-phi.herokuapp.com/sensor/alarme', 
  		method: 'GET', 
  	}, 
  	function(error, request, body){
    	r = body.substring(1, body.length - 1);
  		etranca = r;
  	});

  	request(  { 
  		url: 'https://mydream-ufpa-phi.herokuapp.com/sensor/e_vent', 
  		method: 'GET', 
  	}, 
  	function(error, request, body){
    	r = body.substring(1, body.length - 1);
  		eventilador = r;
  	});

  	request(  { 
  		url: 'https://mydream-ufpa-phi.herokuapp.com/sensor/e_lamp1', 
  		method: 'GET', 
  	}, 
  	function(error, request, body){
    	r = body.substring(1, body.length - 1);
  		elampada = r;
  	});

  	request(  { 
  		url: 'https://mydream-ufpa-phi.herokuapp.com/sensor/e_lamp2', 
  		method: 'GET', 
  	}, 
  	function(error, request, body){
    	r = body.substring(1, body.length - 1);
  		eabajur = r;
  	});

  	request(  { 
  		url: 'https://mydream-ufpa-phi.herokuapp.com/sensor/e_janela', 
  		method: 'GET', 
  	}, 
  	function(error, request, body){
    	r = body.substring(1, body.length - 1);
  		ejanela = r;
  	});

  	request(  { 
  		url: 'https://mydream-ufpa-phi.herokuapp.com/sensor/e_cortina', 
  		method: 'GET', 
  	}, 
  	function(error, request, body){
    	r = body.substring(1, body.length - 1);
  		ecortina = r;
  	});
}
