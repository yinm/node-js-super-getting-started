const express = require('express');
const ejs = require('ejs');

const app = express();
app.engine('ejs', ejs.renderFile);
app.use(express.static('public'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  const msg =
    'This is Index Page!<br>'
  + 'メッセージを書いて送信してください。';

  const data = {
    'Taro': 'taro@yamada',
    'Hanako': 'hanako@flower',
    'Sachiko': 'sachiko@happy',
    'Ichiro': 'ichiro@baseball',
  };

  res.render('index.ejs', {
    title: 'Index',
    content: msg,
    data: data,
  });
});

app.post('/', (req, res) => {
  const msg = 'あなたは「<b>' + req.body.message + '</b>」と送信しました。';

  res.render('index.ejs', {
    title: 'Posted',
    content: msg,
  });
});

app.listen(3000, () => {
  console.log('Server is running!');
});