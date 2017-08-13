const http = require('http');
const fs = require('fs');
const ejs = require('ejs');

const indexPage = fs.readFileSync('./index.ejs', 'utf8');

const server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server start!');

function getFromClient(req, res) {
  const content = ejs.render(indexPage);
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(content);
  res.end();
}
