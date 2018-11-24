const passport = require('koa-passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const config = require('./config').facebook;

passport.use(
  new FacebookStrategy(
    {
      clientID: config.clientId,
      clientSecret: config.clientSecret,
      callbackURL: config.callbackUrl,
      profileFields: config.profileFields
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log('//////////TOKEN', accessToken, '/////////PROFILE', profile);

      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
