const express = require('express')
require('dotenv').config()

const server = express()
const routes = express.Router()
const port = process.env.PORT

server.listen(port, ()=> {
    console.log(`Trivialiti - servidor corriendo en el puerto ${port}`)
})

module.exports = { server, routes }