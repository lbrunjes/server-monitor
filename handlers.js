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
			
			http.get(url,(response)=>{handlers.http.evaluateResult(server, response);});

		},
		evaluateResult:function(server, response){

				//we dont care about data. just teh status code
			
			   response.on('error', (err) => {
			   	addResult(server,false,err.message);
			   });

			   addResult (server, response.statusCode< 500?true:false, response.statusCode)
		}
	}

	this.https={
		makeRequest:function(server, url){
			console.log(server, url);
			
			http.get(url,(response)=>{handlers.http.evaluateResult(server, response);});
		},
		evaluateResult:function(result){

		}

	}

	this.ping = {
		makeRequest:function(server, url){
			ping.sys.probe(url,(alive)=>{ 
				handlers.ping.evaluateResult(server,alive);
			})
		},
		evaluateResult:function(server, result){
			addResult(server,result,result?"Responded":"No Response");
		}
	}

}


module.exports = new handlers();