//*********************************************************************************************************
//* Explanation 
//* Author : Salma 
//*********************************************************************************************************
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecipeSchema  = new Schema({

    //your fields name goes here
    name: {
        type: Schema.Types.String,
        required: true
    },
    slug: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    tags: {
        type: [String]
    },
    image: {
        type: Schema.Types.ObjectId,
        ref: 'Image'
    },
    quantity: {
        type: String
    },
    time: {
        type: String
    },
    ingredients: [{
        item: String,
        item_id: String
    }],
    instructions: [{
        item: String,
        item_id: String
    }]
}, {timestamps: true});

module.exports = mongoose.model('Recipe', RecipeSchema);