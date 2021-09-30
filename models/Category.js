//*********************************************************************************************************
//* Explanation 
//* Author : Salma 
//*********************************************************************************************************
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Category  = new Schema({
    image: {type: Schema.Types.ObjectId, ref: 'Image'},
    name: {type: String, required: true}
});

module.exports = mongoose.model('Category', Category);