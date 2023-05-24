const { connect } = require('./src/utils/db')

const {server,routes} =require('./src/utils/server')
connect()

server.use('/api/v1/frontend', routes)

routes.get('/test', (req,res,next)=> {
    res.status(200).json({message: 'test'})
})

