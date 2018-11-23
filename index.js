const Koa = require('koa');
const app = new Koa();
const Router = require('./router.js');

require('dotenv').config();

app.use(Router.routes());

try {
  app.listen(3001);
} catch (err) {
  console.error('Could not start the server.'); // eslint-disable-line no-console
  console.error(err); // eslint-disable-line no-console
}
