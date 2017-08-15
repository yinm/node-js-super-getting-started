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
  res.redirect('/');
});

router.get('/:id', (req, res, next) => {
  if (req.session.login === undefined) {
    res.redirect('/login');
    return;
  }

  Markdata.query({where: {user_id: req.session.login.id}, andwhere: {id: req.params.id}})
    .fetch()
    .then((model) => {
      makePage(req, res, model, true);
    });
});

router.post('/:id', (req, res, next) => {
  new Markdata({id: req.params.id})
    .save({content: req.body.source}, {patch: true})
    .then((model) => {
      makePage(req, res, model, false);
    });
});

function makePage(req, res, model, flg) {
  let footer;

  if (flg) {
    const createdDate = new Date(model.attributes.created_at);
    const updatedDate = new Date(model.attributes.updated_at);

    const createdDateString =
      createdDate.getFullYear() + '-' +
      (createdDate.getMonth() + 1) + '-' +
      createdDate.getDate();

    const updatedDateString =
      updatedDate.getFullYear() + '-' +
      (updatedDate.getMonth() + 1) + '-' +
      updatedDate.getDate();

    footer = '(created: ' + createdDateString + ', updated: ' + updatedDate + ')';
  } else {
    footer = '(Updating date and time information...)';
  }

  const data = {
    title: 'Markdown',
    id: req.params.id,
    head: model.attributes.title,
    footer: footer,
    content: markdown.toHTML(model.attributes.content),
    source: model.attributes.content
  };

  res.render('mark', data);
}

module.exports = router;