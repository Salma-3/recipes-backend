const express = require('express')
const cors = require('cors')
//const config = require('config')
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser')
require('dotenv').config({path: `.env.${process.env.NODE_ENV}`})

const app = express()


connectDB()




app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors({
    origin: ['http://localhost:3000']
}))

app.use(cookieParser())

app.get('/', (req, res)=> {
    res.send('Deployed successfully')
})


app.use('/api/users', require('./routes/users.routes'))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/categories', require('./routes/categories.routes'))
app.use('/api/images', require('./routes/images.routes'))
app.use('/api/recipes', require('./routes/recipes.routes'))
app.use('/api/contact', require('./routes/contact.routes'))

const port = process.env.PORT || 5000
//const env = config.util.getEnv('NODE_ENV').toUpperCase()

app.listen(port, ()=> {
    console.log(`${process.env.NODE_ENV.toUpperCase()}: Listening on port ${port}`)
})




