const passport = require('./passport');

module.exports = (router) => {
  function* isLoggedIn(next) {
    if (this.req.isAuthenticated()) {
      // console.log('logged in');
      yield next;
    } else {
      // console.log('redirect');
      this.redirect('/api');
    }
  }

  router.get('/', function() {
    if (this.req.user) {
      // console.log('redirect from here');
      this.redirect('/api/success');
    } else {
      // console.log('stay here, not logged in');
      this.body = {
        status: 'success',
        data: 'Hi! If you see this message, it means you\'re not login yet'
      };
    }
  });

  router.get(
    '/login',
    passport.authenticate('facebook', {
      scope: [ 'public_profile', 'email' ]
    })
  );

  router.get(
    '/auth/callback',
    passport.authenticate('facebook', {
      successRedirect: '/api/success',
      failureRedirect: '/api'
    })
  );

  router.get('/success', isLoggedIn, function() {
    // console.log('came here at leas once');
    this.body = {
      status: 'success',
      data: this.req.user
    };
    this.status = 200;
  });

  router.get('/logout', isLoggedIn, function() {
    this.req.logout();
    this.body = {
      status: 'success',
      data: 'logout success'
    };
    this.status = 200;
  });

  return router;
};
