'use strict'
const Picture = require('../models/picture')
const User = require('../models/user')

module.exports = {
  all() {
    return find({})
  },
  newPicture(picture) {
    return new Promise((resolve, reject) => {
      let newPicture = new Picture(picture)
      newPicture.save((err, result) => err ? reject(err) : resolve(result))
    })
  },
  byId(id) {
    return find({ _id: id }).then(result => result ? result[0] : null)
  },
  byUser(userId) {
    return find({ userId })
  },
  deleteById(id) {
    return new Promise((resolve, reject) => Picture.deleteOne({
      _id: id
    }, (err, result) => err ? reject(err) : resolve(result)))
  },
  update(picture) {
    return new Promise((resolve, reject) =>
      Picture.findOneAndUpdate({
        _id: picture._id
      }, picture, (err, result) => err ? reject(err) : resolve(result))
    )
  }
}

function find(query) {
  return new Promise((resolve, reject) => Picture.find(query, (err, requests) => {
    if (err) return reject(err)
    const promises = requests.map(addUser)
    Promise.all(promises)
      .then(resolve)
  }))
}

function addUser(picture) {
  return new Promise((resolve, reject) => User.findById(picture.userId)
    .then(user => resolve({
      title: picture.title,
      url: picture.url,
      _id: picture._id,
      user
    }))
    .catch(reject)
  )
}
