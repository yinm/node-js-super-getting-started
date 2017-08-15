const express = require('express');
cosnt router = express.Router();

const knex = require('knex')({
  dialect: 'sqlite3',
  connection: {
    filename: 'board_data.sqlite3'
  },
  useNullAsDefault: true
});

const Bookshelf = require('bookshelf')(knex);

const User = Bookshelf.Model.extend({
  tableName: 'users'
});

router.get('/add', (req, res, next) => {
  const data = {
    title: 'Users/Add',
    form: {
      name: '',
      password: '',
      comment: ''
    },
    content: '登録する名前・パスワード・コメントを入力してください。'
  };

  res.render('users/add', data);
});

router.post('/add', (req, res, next) => {
  req.check('name', 'Nameは必ず入力してください。').notEmpty();
  req.check('password', 'Passwordは必ず入力してください。').notEmpty();

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      let content = '<ul class="error">';

      const results = result.array();
      for(let n in results) {
        content += '<li>' + results[n].msg + '</li>';
      }
      content += '</ul>';

      const data = {
        title: 'User/Add',
        content: content,
        form: req.body
      };

      res.render('users/add', data);

    } else {
      req.session.login = null;
      new User(req.body).save().then((model) => {
        res.redirect('/');
      });

    }
  });
});

router.get('/', (req, res, next) => {
  const data = {
    title: 'Users/Login',
    form: {
      name: '',
      password: ''
    },
    content: '名前とパスワードを入力してください。'
  };

  res.render('users/login', data);
});

router.post('/', (req, res, next) => {
  req.check('name', 'Nameは必ず入力してください。').notEmpty();
  req.check('password', 'Passwordは必ず入力してください。').notEmpty();

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      let content = '<ul class="error">';

      const results = result.array();
      for(let n in results) {
        content += '<li>' + results[n].msg + '</li>';
      }
      content += '</ul>';

      const data = {
        title: 'User/Login',
        content: content,
        form: req.body
      };
      res.render('users/login', data);

    } else {
      const name = req.body.name;
      const password = req.body.password;

      User.query({where: {name: name}, andWhere: {password: password}})
        .fetch()
        .then((model) => {
          if (model === null) {
            const data = {
              title: '再入力',
              content: '<p class="error">名前またはパスワードが違います。</p>',
              form: req.body
            };
            res.render('users/login', data);

          } else {
            req.session.login = model.attributes;

            const data = {
              title: 'Users/Login',
              content: '<p>ログインしました！<br>トップページに戻ってメッセージを送信ください。</p>',
              form: req.body
            };

            res.render('users/login', data);
          }
      });

    }
  });
});

module.exports = router;
