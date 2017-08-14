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

let data = {msg: 'no message...'};

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
  if (req.method === 'POST') {
    let body = '';

    req.on('data', (data) => {
      body += data;
    });

    req.on('end', () => {
      data = qs.parse(body);
      setCookie('msg', data.msg, res);
      writeIndex(req, res);
    });

  } else {
    writeIndex(req, res);
  }

}

function responseOther(req, res) {
  const title = 'Other';
  const msg = 'これはOtherページです。';
  const data = {
    'Taro': ['taro@yamada', '09-999-999', 'Tokyo'],
    'Hanako': ['hanako@flower', '080-888-888', 'Yokohama'],
    'Sachiko': ['sachi@happy', '070-777-777', 'Nagoya'],
    'Ichiro': ['ichi@baseball', '060-666-666', 'USA'],
  };

  const content = ejs.render(otherPage, {
    title: title,
    content: msg,
    data: data,
    filename: 'data_item',
  });

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(content);
  res.end();
}

function writeIndex(req, res) {
  const title = 'Index';
  const msg = '※伝言を表示します。';
  const cookieData = getCookie('msg', req);

  const content = ejs.render(indexPage, {
    title: title,
    content: msg,
    data: data,
    cookie_data: cookieData,
  });

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(content);
  res.end();
}

function setCookie(key, value, res) {
  const cookie = escape(value);
  res.setHeader('Set-Cookie', [key + '=' + cookie]);
}

function getCookie(key, req) {
  const cookieData = req.headers.cookie !== undefined
    ? req.headers.cookie
    : '';
  const data = cookieData.split(';');

  for (let i in data) {
    if (data[i].trim().startsWith(key + '=')) {
      const result = data[i].trim().substring(key.length + 1);
      return unescape(result);
    }
  }

  return '';
}
