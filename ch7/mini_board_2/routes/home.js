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
  res.redirect('/');
});

router.get('/:id', (req, res, next) => {
  res.redirect('/home/' + req.params.id + '/1');
});

router.get('/:id/:page', (req, res, next) => {
  let id = req.params.id;
  id *= 1;

  let page = req.params.page;
  page *= 1;
  if (page < 1) {
    page = 1;
  }

  new Message()
    .orderBy('created_at', 'DESC')
    .where('user_id', '=', id)
    .fetchPage({page: page, pageSize: 10, withRelated: ['user']})
    .then((collection) => {
      const data = {
        title: 'miniBoard',
        login: req.session.login,
        user_id: id,
        collection: collection.toArray(),
        pagination: collection.pagination
      };

      res.render('home', data);

    }).catch((err) => {
      res
        .status(500)
        .json({
          error: true,
          data: {
            message: err.message
          }
      });
  });

});

module.exports = router;