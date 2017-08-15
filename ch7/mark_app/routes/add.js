const express = require('express');
const router = express.Router();

const markdown = require('markdown').markdown;

const knex = require('knex')({
  dialect: 'sqlite3',
  connection: {
    filename: 'mark_data.sqlite3'
  },
  useNullAsDefault: true
});

const Bookshelf = require('bookshelf')(knex);
Bookshelf.plugin('pagination');

const User = Bookshelf.Model.extend({
  tableName: 'users'
});

const Markdata = Bookshelf.Model.extend({
  tableName: 'markdata',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User);
  }
});

router.get('/', (req, res, next) => {
  if (req.session.login === undefined) {
    res.redirect('/login');
    return;
  }

  res.render('add', { title: 'Add'});
});

router.post('/', (req, res, next) => {
  const record = {
    title: req.body.title,
    content: req.body.content,
    user_id: req.session.login.id
  };

  new Markdata(record).save().then((model) => {
    res.redirect('/');
  });
});

module.exports = router;
