module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    // get the user out of session and pass to template
    res.locals.user = req.user
    res.render('index')
  })

  app.get('/auth/twitter', passport.authenticate('twitter'))

  // handle the callback after twitter has authenticated the user
  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }))

  app.get('/profile', isLoggedIn, (req, res) =>
    // get the user out of session and pass to template
    //res.locals.user = req.user
    res.render('profile')
  )

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    // get the user out of session and pass to template
    res.locals.user = req.user
    return next()
  }
  // if they aren't redirect them to the home page
  res.redirect('/')
}
