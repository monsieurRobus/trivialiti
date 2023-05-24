const mongoose = require('mongoose')
require('dotenv').config()


const mongoUrl = process.env.MONGODB

const connect = async () => {

    try {
        const db = await mongoose.connect(mongoUrl, {  useNewUrlParser: true, useUnifiedTopology: true })
        const {name, host} = db.connection
        console.log(`Base de datos conectada. 🚀 ${name} at ${host}`)
    }
    catch (error) {
        console.log(error)
    }
    

}

module.exports = { connect }