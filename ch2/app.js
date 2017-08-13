const http = require('http');
const fs = require('fs');
let request;
let response;

const server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server start!');

// createServerの処理
function getFromClient(req, res) {
  request = req;
  response = res;
  fs.readFile('./index.html', 'utf-8', writeToResponse);
}

// readFile完了後の処理
function writeToResponse(error, data) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(data);
  response.end();
}