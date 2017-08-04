'use strict'
const TwitterStrategy = require('passport-twitter').Strategy
const User = require('../app/models/user')

module.exports = function(passport) {
  // passport session setup
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
  passport.use(new TwitterStrategy({
      consumerKey: process.env.TWITTER_KEY,
      consumerSecret: process.env.TWITTER_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK
    },
    (token, tokenSecret, profile, done) => {
      process.nextTick(() => {
        User.findOne({ 'twitter.id': profile.id }, (err, user) => {
          // if there is an error, stop everything and return that
          // ie an error connecting to the database
          if (err) return done(err)

          // if the user is found then log them in
          if (user) {
            // user found, return that user
            return done(null, user)
          }
          else {
            // if there is no user, create them
            let newUser = new User()

            // set all of the user data that we need
            newUser.twitter.id = profile.id;
            newUser.twitter.token = token;
            newUser.twitter.username = profile.username;
            newUser.twitter.displayName = profile.displayName;

            // save our user into the database
            newUser.save(err => {
              if (err) throw err
              return done(null, newUser)
            })
          }
        })
      })
    }))
}
