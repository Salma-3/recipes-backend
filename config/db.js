const mongoose = require('mongoose')
//const config = require('config')
require('dotenv').config({path: `.env.${process.env.NODE_ENV}`})

const URI = process.env.MONGODB_URI

async function connectDB(){
    try {
        await mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true})
        console.log('Connected to '+URI)
    } catch (err) {
        console.error(err)
        process.exit(9)
    }
}

module.exports = connectDB