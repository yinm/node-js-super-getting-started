const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');
const qs = require('querystring');

const indexPage = fs.readFileSync('./index.ejs', 'utf8');
const otherPage = fs.readFileSync('./other.ejs', 'utf8');
const styleCss = fs.readFileSync('./style.css', 'utf8');

const server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server start!');

function getFromClient(req, res) {
  const urlParts = url.parse(req.url, true);

  switch (urlParts.pathname) {
    case '/':
      responseIndex(req, res);
      break;

    case '/other':
      responseOther(req, res);
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

function responseIndex(req, res) {
  const title = 'Index';
  const msg = 'これはIndexページです。';

  const content = ejs.render(indexPage, {
    title: title,
    content: msg,
  });

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(content);
  res.end();
}

function responseOther(req, res) {
  const title = 'Other';

  if (req.method === 'POST') {
    let body = '';

    // データ受信のイベント処理
    req.on('data', (data) => {
      body += data;
    });

    // データ受信終了のイベント処理
    req.on('end', () => {
      const postData = qs.parse(body);
      let msg = 'これはOtherページです。';
      msg += 'あなたは、「' + postData.msg + '」と書きました。';

      const content = ejs.render(otherPage, {
        title: title,
        content: msg,
      });

      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(content);
      res.end();
    });

  } else {
     const msg = 'ページがありません';
     const content = ejs.render(otherPage, {
       title: title,
       content: msg,
     });

     res.writeHead(200, {'Content-Type': 'text/html'});
     res.write(content);
     res.end();
  }

}

