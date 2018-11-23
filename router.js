const Router = require('koa-router');
const router = new Router();

router.get('', (ctx) => {
  ctx.body = 'routing works';
});

module.exports = router;
