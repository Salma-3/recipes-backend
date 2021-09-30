//*********************************************************************************************************
//* Explanation 
//* Author : Salma 
//*********************************************************************************************************
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Contact  = new Schema({

    //your fields name goes here

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Contact', Contact);