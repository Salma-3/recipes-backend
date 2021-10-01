const mongoose = require('mongoose')
//const config = require('config')
require('dotenv').config({path: `.env.${process.env.NODE_ENV}`})

const URI = process.env.MONGODB_URI

async function connectDB(){
    //console.log(URI)
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true,
            authSource: 'admin',
            retryWrites: true,
        }
        await mongoose.connect(URI, options)
        console.log('Connected to '+URI)
    } catch (err) {
        console.error(err)
        process.exit(9)
    }
}

module.exports = connectDB