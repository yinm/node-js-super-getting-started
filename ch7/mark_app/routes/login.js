const express = require('express');
const router = express.Router();

const knex = require('knex')({
  dialect: 'sqlite3',
  connection: {
    filename: 'mark_data.sqlite3'
  },
  useNullAsDefault: true
});

const Bookshelf = require('bookshelf')(knex);

const User = Bookshelf.Model.extend({
  tableName: 'users'
});

router.get('/', (req, res, next) => {
  const data = {
    title: 'Login',
    form: {
      name: '',
      password: ''
    },
    content: '名前とパスワードを入力ください。'
  };
  res.render('login', data);
});

router.post('/', (req, res, next) => {
  req.check('name', 'Nameは必ず入力してください。').notEmpty();
  req.check('password', 'Passwordは必ず入力してください。').notEmpty();

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      let content = '<ul class="error">';

      const results = result.array();
      for (let i in results) {
        content += '<li>' + results[i].msg + '</li>';
      }
      content += '</ul>';

      const data = {
        title: 'Login',
        content: content,
        form: req.body
      };
      res.render('login', data);

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
            res.render('login', data);

          } else {
            req.session.login = model.attributes;

            const data = {
              title: 'Login',
              content: '<p>ログインしました！<br>トップページに戻ってメッセージを送信ください。</p>',
              form: req.body
            };
            res.render('login', data);
          }
        });

    }
  });
});

module.exports = router;