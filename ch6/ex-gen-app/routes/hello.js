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
    content: '新しいレコードを入力:',
    form: {
      name: '',
      mail: '',
      age: 0
    }
  };

  res.render('hello/add', data);
});

router.post('/add', (req, res, next) => {
  req.check('name', 'Name は必ず入力してください。').notEmpty();
  req.check('mail', 'Mail はメールアドレスを記入してください。').isEmail();
  req.check('age', 'Age は年齢(整数)を入力してください。').isInt();

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      let errorResponse = '<ul class="error">';

      const resultArray = result.array();
      for(let n in resultArray) {
        errorResponse += '<li>' + resultArray[n].msg + '</li>';
      }
      errorResponse += '</ul>';

      const data = {
        title: 'Hello/Add',
        content: errorResponse,
        form: req.body
      };
      res.render('hello/add', data);

    } else {
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
    }
  });

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

router.get('/edit', (req, res, next) => {
  const id = req.query.id;

  db.serialize(() => {
    const q = 'select * from mydata where id = ?';

    db.get(q, [id], (err, row) => {
      if (!err) {
        const data = {
          title: 'hello/edit',
          content: 'id = ' + id + ' のレコードを編集:',
          mydata: row
        };

        res.render('hello/edit', data);
      }
    });
  });
});

router.post('/edit', (req, res, next) => {
  const id = req.body.id;
  const name = req.body.name;
  const mail = req.body.mail;
  const age = req.body.age;

  const query = 'update mydata set name = ?, mail = ?, age = ? where id = ?';
  db.run(query, name, mail, age, id);

  res.redirect('/hello');
});

router.get('/delete', (req, res, next) => {
  const id = req.query.id;

  db.serialize(() => {
    const query = 'select * from mydata where id = ?';

    db.get(query, [id], (err, row) => {
      if (!err) {
        const data = {
          title: 'Hello/Delete',
          content: 'id = ' + id + ' のレコードを削除:',
          mydata: row
        };

        res.render('hello/delete', data);
      }
    });
  });
});

router.post('/delete', (req, res, next) => {
  const id = req.body.id;
  const query = 'delete from mydata where id = ?';

  db.run(query, id);

  res.redirect('/hello');
});

module.exports = router;
