const apiRouter = require("express").Router();
const topicsRouter = require('./topicsrouter');
const articlesRouter = require('./articlesrouter');
const usersRouter = require('./usersrouter');
const commentsRouter = require('./commentsrouter');
const hellothereRouter = require('./hellorouter')
const {getEndpoints} = require('../controllers/apicon')
const {invalidMeth} = require('../errorhandlers')

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/users" , usersRouter);

apiRouter.use('/comments', commentsRouter);

apiRouter.use('/hellothere', hellothereRouter);

apiRouter.route('/').get(getEndpoints).all(invalidMeth)


module.exports = apiRouter;