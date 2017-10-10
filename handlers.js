/*
Handlers for 




*/

const ping = require('ping');
const http = require('http');
const https = require('https');

var handlers = function(){
	handlers = this;


	this.http = {
		makeRequest:function(server, url){

		},
		evaluateResult:function(server, result){

		}
	}

	this.https={
		makeRequest:function(server, url){

		},
		evaluateResult:function(result){

		}

	}

	this.ping = {
		makeRequest:function(server, url){
			ping.sys.probe(url,function(alive){ 
				handlers.ping.evaluateResult(server,alive);
			})
		},
		evaluateResult:function(server, result){
			addResult(server,result,result?"Responded":"No Response");
		}
	}

}


module.exports = new handlers();