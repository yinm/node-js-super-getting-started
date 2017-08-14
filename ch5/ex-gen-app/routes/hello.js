const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const data = {
    title: 'Hello!',
    content: 'これは、サンプルのコンテンツです。<br>this is sample content.'
  };

  res.render('hello', data);
});

module.exports = router;