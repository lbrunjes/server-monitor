/*
Handlers for server monitor.
Lee Brunjes 2017 lee.brunjes@gmail.com
This make sthe requests taht return to the system


*/

const ping = require('ping');
const http = require('http');
const https = require('https');

var handlers = function(){
	handlers = this;


	this.http = {
		makeRequest:function(server, url){
			console.log(server, url);
			var opts = {
				port: 80,
				hostname: server.hostname,
				method: 'GET',
				path: server.path? server.path:"/"
			};

			http.get(url)

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