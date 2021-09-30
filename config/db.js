const mongoose = require('mongoose')
const config = require('config')


const URI = config.get('mongoURI')

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