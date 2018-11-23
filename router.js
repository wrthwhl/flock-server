const Router = require('koa-router');
const router = new Router();

require('dotenv').config();

import passport from 'passport';
import FacebookStrategy from 'passport-facebook';

passport.use(
  new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK
  })
);

router.get('', (ctx) => {
  ctx.body = 'routing works';
});

module.exports = router;
