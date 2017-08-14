const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');
const qs = require('querystring');

const indexPage = fs.readFileSync('./index.ejs', 'utf8');
const loginPage = fs.readFileSync('./login.ejs', 'utf8');
const styleCss = fs.readFileSync('./style.css', 'utf8');
const partialFile = 'data_item';

const maxNum = 10;
const filename = 'mydata.txt';
let messageData;
readFromFile(filename);

const server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server start!');

function getFromClient(req, res) {
  const urlParts = url.parse(req.url, true);

  switch(urlParts.pathname) {
    case '/':
      responseIndex(req, res);
      break;

    case '/login':
      responseLogin(req, res);
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
      const data = qs.parse(body);
      addToData(data.id, data.msg, filename, req);
      writeIndex(req, res);
    });

  } else {
    writeIndex(req, res);
  }

}

function writeIndex(req, res) {
  const title = 'Index';
  const msg = '※何かメッセージを書いてください。';

  const content = ejs.render(indexPage, {
    title: title,
    content: msg,
    data: messageData,
    filename: partialFile,
  });

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(content);
  res.end();
}

function responseLogin(req, res) {
  const content = ejs.render(loginPage, {});

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(content);
  res.end();
}

function readFromFile(fname) {
  fs.readFile(fname, 'utf8', (err, data) => {
    messageData = data.split('\n');
  })
}

function addToData(id, msg, fname, req) {
  const obj = {'id': id, 'msg': msg};
  const objString = JSON.stringify(obj);
  console.log('add data: ' + objString);

  messageData.unshift(objString);
  if (messageData.length > maxNum) {
    messageData.pop();
  }

  saveToFile(fname);
}

function saveToFile(fname) {
  const dataString = messageData.join('\n');

  fs.writeFile(fname, dataString, (err) => {
    if (err) { throw err; }
  });
}

