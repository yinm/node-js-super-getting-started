const http = require('http');

const server = http.createServer(
  (req, res) => {
    res.end('Hello Node.js!');
  }
);

server.listen(3000);