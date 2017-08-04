'use strict'
const mongoose = require('mongoose')

// define the schema for our user model
const User = mongoose.Schema({
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  }
})

// create the model for users and expose it to our app
module.exports = mongoose.model('User', User)