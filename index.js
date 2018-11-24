const Koa = require('koa');
const app = new Koa();

const session = require('koa-session');

require('dotenv').load();

const config = require('./config');
const router = require('./router');
const passport = require('./passport');

app.keys = config.session.keys;

app.use(session(app));
app.use(passport.initialize());
app.use(passport.session());

// router.use('/api', api.routes());
app.use(router.routes());
app.use(router.allowedMethods());

try {
  app.listen(3001);
} catch (err) {
  console.error('Could not start the server.'); // eslint-disable-line no-console
  console.error(err); // eslint-disable-line no-console
}
