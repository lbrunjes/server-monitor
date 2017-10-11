/*





*/
const fs = require('fs');

var rest_api = function(){
	api = this;

	this.rest = function(request, response){
		try{
			console.log(request.url);
			response.writeHead(200);
			
			if(request.url.indexOf("/api") === 0){
				//do api handling
				response.end(JSON.stringify(results));
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
				
				
				console.log(url,result);

				response.end(fs.readFileSync("./web"+result));
			}
		}
		catch(ex){
			console.log("Error Processing http request",ex);
				response.writeHead(500);
				response.end();
		}

	}

}


module.exports = new rest_api();