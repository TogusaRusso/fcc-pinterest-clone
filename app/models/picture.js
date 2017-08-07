'use strict'
const mongoose = require('mongoose')

// define the schema for our user model
const Picture = mongoose.Schema({
  title: String,
  url: String,
  userId: String
})

// create the model for users and expose it to our app
module.exports = mongoose.model('Picture', Picture)
