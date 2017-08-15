const express = require('express');
const router = express.Router();

const knex = require('knex')({
  dialect: 'sqlite3',
  connection: {
    filename: 'board_data.sqlite3'
  },
  useNullAsDefault: true
});

const Bookshelf = require('bookshelf')(knex);

Bookshelf.plugin('pagination');

const User = Bookshelf.Model.extend({
  tableName: 'users'
});

const Message = Bookshelf.Model.extend({
  tableName: 'messages',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User);
  }
});

router.get('/', (req, res, next) => {
  if (req.session.login === undefined) {
    res.redirect('/users');
  } else {
    res.redirect('/1');
  }
});

router.get('/:page', (req, res, next) => {
  if (req.session.login === null) {
    res.redirect('/users');
    return;
  }

  let page = req.params.page;
  page *= 1;
  if (page < 1) {
    page = 1;
  }

  new Message()
    .orderBy('created_at', 'DESC')
    .fetchPage({page:page, pageSize:10, withRelated: ['user']})
    .then((collection) => {
      const data = {
        title: 'miniBoard',
        login: req.session.login,
        collection: collection.toArray(),
        pagination: collection.pagination
      };

      res.render('index', data);
    }).catch((err) => {
      res.status(500).json({
        error: true,
        data: {
          message: err.message
        }
      });
  });
});

router.post('/', (req, res, next) => {
  const record = {
    message: req.body.msg,
    user_id: req.session.login.id
  }

  new Message(record).save().then((model) => {
    res.redirect('/');
  });
});

module.exports = router;