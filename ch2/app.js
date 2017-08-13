const http = require('http');

const server = http.createServer(
  (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.write('<!doctype html><html lang="ja">');
    res.write('<head><meta charset="utf-8">');
    res.write('<title>Hello</title></head>');
    res.write('<body><h1>Hello Node.js!</h1>');
    res.write('<p>This is Node.js sample page.</p>');
    res.write('<p>これは、Node.jsのサンプルページです。</p>', 'utf8');
    res.write('</body></html>');
    res.end();
  }
);

server.listen(3000);
console.log('Server start!');