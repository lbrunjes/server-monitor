/*
Start.js
Lee Brunjes 2017 lee.brunjes@gmail.com

Starts up the monitor server

*/
const ping = require('ping');
const http = require('http');
const https = require('https');
const fs = require('fs');
const handlers = require("./handlers.js")
const api = require("./api.js")

var configfile= "config.json";
var packageinfofile = "package.json";

global.config= {
	"servers":[
		{"hostname":"127.0.0.1","type":"ping", "frequency":5},
		{"hostname":"127.0.0.1","type":"http", "frequency":5},
		{"hostname":"127.0.0.1","type":"http", "frequency":5, "path":"/to/url.html"}
	],
	"settings":{
		"history_size":100,
		"allowed_types":["http","https", "ping"],
		"use_https":false,
		"https_priv_key":"./privkey.cert",
		"https_cert":"./pubkey.cert",
		"port":8080,
		"verbose":false,
		"refresh_time":5000
	}
};
global.results={}
var server = null;

console.log("Startup");


//load other options from CLI
if (process.argv.length>2){
	configfile = process.argv[2];
}


//read config
var config_tmp = JSON.parse(fs.readFileSync(configfile));
var tmp_keys= Object.keys(config_tmp);
for(var key in config){
	if(tmp_keys.indexOf(key>=0)){
		config[key] = config_tmp[key];
	}
}
//read package info
global.packageinfo = JSON.parse(fs.readFileSync(packageinfofile));
console.log(packageinfo.name+" v"+packageinfo.version);


for(var i in config.servers){

	//deal with hostname collison
	if(!results[config.servers[i].hostname]){
	results[config.servers[i].hostname] = [{
		hostname:config.servers[i].hostname, 
		details:config.servers[i], 
		last:new Date(0),
		history:[]}];
	}
	else{
		results[config.servers[i].hostname].push({
		hostname:config.servers[i].hostname, 
		details:config.servers[i], 
		last:new Date(0),
		history:[]})
	}
}

console.log("Read config complete");


global.verbose=function(){
	if (config.settings.verbose){
		console.log(arguments)
	}
}



//define data to be called from handlers
global.addResult = function(server, was_success,details){

	verbose("adding result", server, was_success, details);

	for (var i =0 ;i < results[server.hostname].length ;i++){
		if(results[server.hostname][i].details.type == server.type && 
			results[server.hostname][i].details.path == server.path){
			
			results[server.hostname][i].history.push({
				ok:was_success, 
				time:new Date(), 
				detail:details,
				duration: (new Date() - results[server.hostname][i].last)
			});
		}
		//remove the 0th element if we are too long
		if(results[server.hostname][i].history.length> config.settings.history_size){
			results[server.hostname][i].history.splice(0,1);
		}
	}

	
};

//pick the correct handler and normalize data before sending.
var testServer = function(server_config,i){
	verbose("testing ", server_config);
	//ensure we hava supported type
	if(!handlers[server_config.type]){
		console.log("unsupported type", server_config.type);
		return;
	}

	var url = server_config.hostname;

	//edit url as needed for item to work
	switch(server_config.type){
		case "http":
		case "https":
		url=server_config.type+"://"+url;
		if(server_config.path){
			url += server_config.path;
		}
		break;
		default:
		break;
	}

	//at this point we have  handler, call it and mark it called.
	verbose("calling", server_config.hostname);
	try{
		results[server_config.hostname][i].last = new Date();
		handlers[server_config.type].makeRequest(server_config,url);
	}
	catch(ex){
		addResult(server_config, false, ex.message);
	}

}
var findNeededTests = function(){
	verbose("checking for tests to run");
	for(var host in results){
		for( var i = 0 ;i < results[host].length;i++){
			//has it been more than frequency minutes since out last check?
			var msago = results[host][i].details.frequency * 60 *1000;
			if(results[host][i].last.getTime()+msago < new Date().getTime()){

				testServer(results[host][i].details,i);
			}
		}
	}

}
findNeededTests();
//call it every so often
setInterval(findNeededTests, config.settings.refresh_time);


//setup server using http or https
if(!config.settings.use_https){
	server = http.createServer(api.rest);
}
else{
	options = {
	  key: fs.readFileSync(config.settings.https_priv_key),
	  cert: fs.readFileSync(config.settings.https_cert)
	};
	https.createServer(options, api.rest);
}

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(config.settings.port);

console.log("api up on port", config.settings.port);