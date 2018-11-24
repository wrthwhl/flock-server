exports.loggedMiddleware = async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    await next();
  } else {
    ctx.redirect('/api');
  }
};