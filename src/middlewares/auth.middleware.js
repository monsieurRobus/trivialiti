const User = require('../api/models/User.model')
const { verifyToken } = require('../utils/token') 
require('dotenv').config()

const isAuth = async (req,res,next) => {

    const token = req.headers.authorization?.replace('Bearer ','')

    if(!token)
    {
        return next(new Error('Unauthorized'))
    }


    try {
        const decoded = verifyToken(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id)

        return next()
    }
    catch (error)
    {
        return next(error)
    }

}

const isPropertyOwner = async (req,res,next) => {

}

const isAdmin = async (req,res,next) => {

    const token = req.headers.authorization?.replace('Bearer ','')

    if(!token)
    {
        return next(new Error('Unauthorized'))
    }


    try {
        const decoded = verifyToken(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id)

        if(req.user.role !== 'admin'){
            return next(new Error('Unauthorized, not admin'))
        }

        next()
    }
    catch (error)
    {
        return next(error)
    }

}

module.exports = {
    isAuth,
    isAdmin
}