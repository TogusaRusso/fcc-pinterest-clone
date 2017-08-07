const path = require('path')
const pictureController = require('./controllers/picture')

module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    // get the user out of session and pass to template
    res.locals.user = req.user
    pictureController.all()
      .then(pictures => res.render('index', { pictures }))
      .catch(err => console.error(err))
  })

  app.get('/auth/twitter', passport.authenticate('twitter'))

  // handle the callback after twitter has authenticated the user
  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/',
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

  app.route('/new')
    .get(isLoggedIn, (req, res) =>
      res.render('newPicture')
    )
    .post(isLoggedIn, (req, res) => {
      const picture = {
        title: req.body.title,
        url: req.body.url,
        userId: req.user._id,
      }
      pictureController.newPicture(picture)
        .then(() => res.redirect('/'))
        .catch(err => console.error(err))
    })

  app.get('/wall/:userId', (req, res) => {
    res.locals.user = req.user
    pictureController.byUser(req.params.userId)
      .then(pictures => res.render('index', { pictures }))
      .catch(err => console.error(err))
  })

  app.get('/delete/:pictureId', isLoggedIn, (req, res) => {
    pictureController.byId(req.params.pictureId)
      .then(picture => {
        if ('' + req.user._id !== '' + picture.user._id) return res.redirect('/')
        pictureController.deleteById(req.params.pictureId)
          .then(result => res.redirect('/'))
          .catch(err => { throw err })
      })
      .catch(err => console.error(err))
  })

  app.get('/broken.png', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/broken-file-icon-hi.png'))
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
