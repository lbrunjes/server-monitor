/*
REST API
Lee Brunjes 2017 lee.brunjes@gmail.com

This does the rest api for the service

*/
const fs = require('fs');

var rest_api = function(){
	api = this;

	this.rest = function(request, response){
		try{
			verbose(request.url);

			//TODO http basic auth

			
			
			if(request.url.indexOf("/api/") === 0){
				//do api handling
				console.log(request.url.substring(5));
				switch(request.url.substring(5)){

					case "status":
						response.writeHead(200,{"Content-Type": "application/json; charset=utf-8"});
						response.end(JSON.stringify(results));
					break;
					case "config":
						response.writeHead(200,{"Content-Type": "application/json; charset=utf-8"});
						response.end(JSON.stringify(config));
					break;
					case "about":
						response.writeHead(200,{"Content-Type": "application/json; charset=utf-8"});
						response.end(JSON.stringify({
							name:packageinfo.name,
							version:packageinfo.version

						}));
					break;
					default:
						response.writeHead(404,{"Content-Type": "application/json; charset=utf-8"});
						response.end(JSON.stringify({"no_found":true}));
					break;

				}
				
			}
			else{
				var url =request.url;
				//support default doc
				if(!url || url ==="/"){
					url = "/index.html";
				}
				//all paths astart with/
				if(url.indexOf("/") <0){
					url= "/"+url

				}
				//in all other cases pull the last file and write to web
				var result= /(?:\/[^\/]+?)$/.exec(url);
				
				verbose(url,result);
				response.writeHead(200);
				response.end(fs.readFileSync("./web"+result));
			}
		}
		catch(ex){
			console.log("Error Processing http request",ex);
			response.writeHead(500,{"Content-Type": "application/json; charset=utf-8"});
				
			response.end(JSON.stringify({"error":ex}));
		}

	}

}


module.exports = new rest_api();