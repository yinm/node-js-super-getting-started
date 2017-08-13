const http = require('http');
const fs = require('fs');

const server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server start!');

// createServerの処理
function getFromClient(req, res) {
  fs.readFile('./index.html', 'utf-8', (error, data) => {
    const content = data
      .replace(/dummy_title/g, 'タイトルです')
      .replace(/dummy_content/g, 'これがコンテンツです。');

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(content);
    res.end();
  });
}