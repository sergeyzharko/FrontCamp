var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    id: Number,
    title: String,
    author: String,
    body: { type: String, required: [true, 'Where is the body?']},
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', blogSchema);