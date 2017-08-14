const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('mydb.sqlite3');

router.get('/', (req, res, next) => {
  db.serialize(() => {
    db.all('select * from mydata', (err, rows) => {
      if (!err) {
        const data = {
          title: 'Hello!',
          content: rows
        };

        res.render('hello/index', data);
      }
    });
  });

});

router.get('/add', (req, res, next) => {
  const data = {
    title: 'Hello/Add',
    content: '新しいレコードを入力:'
  };

  res.render('hello/add', data);
});

router.post('/add', (req, res, next) => {
  const name = req.body.name;
  const mail = req.body.mail;
  const age = req.body.age;

  db.run(
    'insert into mydata (name, mail, age) values (?, ?, ?)',
    name,
    mail,
    age
  );

  res.redirect('/hello');
});

router.get('/show', (req, res, next) => {
  const id = req.query.id;

  db.serialize(() => {
    const query = 'select * from mydata where id = ?';

    db.get(query, [id], (err, row) => {
      if (!err) {
        const data = {
          title: 'Hello/show',
          content: 'id = ' + id + ' のレコード:',
          mydata: row
        };

        res.render('hello/show', data);
      }
    });
  });
});

module.exports = router;
