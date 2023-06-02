const { connect } = require('./src/utils/db')
const express = require('express')
const routesCategories = require('./src/api/routes/categories.routes')
const routesQuestions = require('./src/api/routes/questions.routes')
const routesUsers = require('./src/api/routes/users.routes')
const {server,routes} =require('./src/utils/server')
connect()

const enpoint= process.env.ENDPOINT

server.use(express.json())
server.use(enpoint, routes)
server.use(`${enpoint}/categories`, routesCategories)
server.use(`${enpoint}/questions`, routesQuestions)
server.use(`${enpoint}/users`, routesUsers)

routes.post('/test', (req,res,next)=> {
    res.status(200).json({message: 'test'})
})
