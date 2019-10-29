const articlesRouter = require('express').Router();
const {getArticles , getArticleByID} = require('../controllers/articlescon');

articlesRouter.route('/').get(getArticles);

articlesRouter.route('/:article_id').get(getArticleByID);

module.exports = articlesRouter;

