const { connect } = require('./src/utils/db')
const express = require('express')
const routesCategories = require('./src/api/routes/categories.routes')
const routesQuestions = require('./src/api/routes/questions.routes')
const {server,routes} =require('./src/utils/server')
connect()

server.use(express.json())
server.use('/api/v1/frontend', routes)
server.use('/api/v1/frontend/categories', routesCategories)
server.use('/api/v1/frontend/questions', routesQuestions)

routes.post('/test', (req,res,next)=> {
    res.status(200).json({message: 'test'})
})
