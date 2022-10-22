const mongoose = require('mongoose')
require('dotenv').config()

const reset = async () => {
    await mongoose.connect(process.env.MONGODB_URI)
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close()
}

reset()



