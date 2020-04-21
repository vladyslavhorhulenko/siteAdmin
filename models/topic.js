const mongoose = require('mongoose');

module.exports = mongoose.model('Topic', new mongoose.Schema({
  title: {type: String, required: true},
  date: Date,
  text: String,
  author: Object
}));
