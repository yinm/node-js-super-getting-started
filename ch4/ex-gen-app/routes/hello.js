const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  const data = {
    title: 'Hello!',
    content: 'これは、サンプルのコンテンツです。<br>this is sample content.',
  };

  res.render('hello', data);
});

router.get('/welcome', (req, res, next) => {
  const data = {
    title: 'Welcome!',
    content: 'Welcome page',
  };

  res.render('hello', data);
});

module.exports = router;