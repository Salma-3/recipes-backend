//*********************************************************************************************************
//* Explanation 
//* Author : Salma 
//*********************************************************************************************************
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema  = new mongoose.Schema({

    //your fields name goes here

    name: {
        type: String,
        required: [true, 'Name is required']
    },
    password: {type: String, required: true},

    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        validate: {
            validator: function(v){
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Invalid Email'
        }
    },
    bio: {type: String, default: ''},
    description: {type: String, default: ''},
    social: {
        twitter: {type: String, default: ''},
        facebook: {type: String, default: ''},
        instagram: {type: String, default: ''}
    },
    avatar: {type: Schema.Types.ObjectId, ref: 'Image', default: null}
});

module.exports = mongoose.model('User', UserSchema);