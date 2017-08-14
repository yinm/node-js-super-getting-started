const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  const name = req.query.name;
  const mail = req.query.mail;

  const data = {
    title: 'Hello!',
    content: 'あなたの名前は、' + name + '。<br>メールアドレスは、' + mail + 'です。',
  };

  res.render('hello', data);
});

module.exports = router;