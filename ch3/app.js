const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');

const indexPage = fs.readFileSync('./index.ejs', 'utf8');
const otherPage = fs.readFileSync('./other.ejs', 'utf8');
const styleCss = fs.readFileSync('./style.css', 'utf8');

const server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server start!');

function getFromClient(req, res) {
  const urlParts = url.parse(req.url, true);
  let content;
  let text;
  let query;

  switch(urlParts.pathname) {

    case '/':
      text = 'これはIndexページです。';
      query = urlParts.query;

      if (query.msg !== undefined) {
        text += 'あなたは、「' + query.msg + '」と送りました。';
      }

      content = ejs.render(indexPage, {
        title: 'Index',
        content: text,
      });
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(content);
      res.end();
      break;

    case '/other':
      content = ejs.render(otherPage, {
        title: 'Other',
        content: 'これは新しく用意したページです。',
      });
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(content);
      res.end();
      break;

    case '/style.css':
      res.writeHead(200, {'Content-Type': 'text/css'});
      res.write(styleCss);
      res.end();
      break;

    default:
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('no page...');
      break;
  }

}
