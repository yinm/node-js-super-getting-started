const http = require('http');
const fs = require('fs');

const server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server start!');

// createServerの処理
function getFromClient(req, res) {
  const request = req;
  const response = res;
  fs.readFile('./index.html', 'utf-8', (error, data) => {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(data);
    response.end();
  });
}