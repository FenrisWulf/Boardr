var http = require('http');
var server = http.createServer();
var fs = require('fs');
var maxFileNum = 1
console.log('running on 3000')
server.on('request', function (request, res) {
  var body = "";
         // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
 	request.on('data', function (chunk) {
    body += chunk;
  });
  request.on('end', function() {
    var data = JSON.parse(body);
    // For now only 1 request type.
    storeData(data)  
    res.writeHead(200);
    res.end()
  })
  
    
})

server.listen(3000);

/* JSON format for recieved data
 {
	imageNum: [int]
	didSwipeRight: [bool] 
 }

JSON file data store
{
	[
		{
			imageNum: [int]
			didSwipeRight: [bool] 
		}
	...
}
*/
function storeData(data) {
	var imageNum = data.imageNum

    if (imageNum > maxFileNum || imageNum < 0) {
    	// Invalid imageNum
        return false;
    }
    var fileData
    var filePath = "./store/"+data.imageNum

    if (!fs.existsSync(filePath)) {
    	fileData = newFileData(imageNum)
    }
    else {
        fileData = JSON.parse(fs.readFileSync(filePath));
    }
	
	if (data.didSwipeRight) {
  		fileData.numSwipesRight++
    }
    else {
    	fileData.numSwipesLeft++
    }

    fs.writeFileSync(filePath, JSON.stringify(fileData));        

    return true;
}

function newFileData(imageNum) {
	var fileData = {}
    fileData.imageNum = imageNum
    fileData.numSwipesRight = 0
    fileData.numSwipesLeft = 0
    return fileData
}