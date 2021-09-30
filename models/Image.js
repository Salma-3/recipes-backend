//*********************************************************************************************************
//* Explanation 
//* Author : Salma 
//*********************************************************************************************************
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Image  = new Schema({
    public_id: {type: String, required: true},
    images: [{
        width: {type: Number, required: true},
        height: {type: Number, required: true},
        format: {type: String},
        url: {type: String, required: true}
    }]
}, {timestamps: true});

module.exports = mongoose.model('Image', Image);