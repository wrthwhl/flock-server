const Router = require('koa-router');
const router = new Router();
const logInController = require('./controllers/index.js');
const { loggedMiddleware } = require('./middleware/loggedMiddlware');

router.get('/api', logInController.redirect);
router.get('/api/login', logInController.logIn);
router.get('/api/auth/callback', logInController.callback);
router.get('/api/success', loggedMiddleware, logInController.success);
router.get('/api/logout', loggedMiddleware, logInController.logout);

module.exports = router;
