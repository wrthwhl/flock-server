const passport = require('../passport');

exports.redirect = ctx => {
  if (ctx.state.user) {
    ctx.redirect('/api/success');
  } else {
    ctx.body = {
      status: 'success',
      data: 'Hi! If you see this message, it means you\'re not login yet'
    };
  }
};

exports.logIn = passport.authenticate('facebook', {
  scope: ['public_profile', 'email']
});

exports.callback = passport.authenticate('facebook', {
  successRedirect: '/api/success',
  failureRedirect: '/api'
});

exports.success = ctx => {
  ctx.body = {
    status: 'success',
    data: ctx.state.user
  };
};

exports.logout = ctx => {
  ctx.logout();
  ctx.body = {
    status: 'success',
    data: 'logout success'
  };
};
