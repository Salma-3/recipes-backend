const express = require('express')
const cors = require('cors')



function createServer(){
    const app = express()

    app.use(express.json())
    app.use(cors())
    
    app.use('/api/users', require('../routes/users.routes'))
    app.use('/api/auth', require('../routes/auth.routes'))
    app.use('/api/images', require('../routes/images.routes'))
    app.use('/api/categories', require('../routes/categories.routes'))
    app.use('/api/recipes', require('../routes/recipes.routes'))
    

    return app;
}

module.exports = {createServer}