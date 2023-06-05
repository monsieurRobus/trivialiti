const { randomCode } = require('../../utils/randomCode')
const bcrypt = require('bcrypt')
require('dotenv').config()
const User = require('../models/User.model')
const { generateToken } = require('../../utils/token')
const nodemailer = require('nodemailer')
const randomPassword = require('../../utils/randomPassword')

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'http://localhost'
const PROTOCOL = process.env.PROTOCOL || 'http'
const ENDPOINT = process.env.ENDPOINT || '/api/v1'


const getUser = async (req, res, next) => {

    try {
        const { id } = req.params
        const userFound = await User.findById(id)

        if(userFound)
        {
            return res.status(200).json(userFound)
        }
        else
        {
            return res.status(404).json({message: 'User not found'})
        }
    }
    catch(error)
    {
        return next(error)
    }
}

const getAllUsers = async (req, res, next) => {

    try 
        {
            const users = await User.find()

            if (!users)
                return res.status(404).json({message: 'Users not found'})
            else
                return res.status(200).json(users)
        }
    catch(error) 
        {
            return next(error)
        }

}

const getUsersByName = async (req, res, next) =>{

    try {
        const { name } = req.params
        const usersFound = await User.find({name: {$regex: name, $options: 'i'}})

        if(usersFound)
        {
            return res.status(200).json(usersFound)
        }
        else
        {
            return res.status(404).json({message: 'Users not found'})
        }
    }
    catch(error)
    {

    }

}

const registerUser = async (req, res, next) => {
    try 
    {
        await User.syncIndexes()
        req.body.avatarImg =`https://api.dicebear.com/6.x/avataaars/svg?seed=${req.body.avatar}&backgroundType=gradientLinear&backgroundColor=ffdf66&style=circle`
        let confirmationCode = randomCode()

        const {email,username} = req.body

        const userExist = await User.findOne(
            {email: email}, 
            {username: username}
        )

        if(!userExist)
            {
                
                const newUser = new User({...req.body, confirmationCode})

                // No tenemos imagen de perfil, usaremos un avatar random de avaaaatars.io

                const userSave = await newUser.save()

                if(userSave)
                    {
                        return res.redirect(307, `${PROTOCOL}${HOST}:${PORT}${ENDPOINT}/users/register/sendMail/${userSave._id}`)
                    }
            }
        else {
            return res.status(409).json({message: 'User already exist'})
        }
        }
    catch(error)
    {
        return next(error)
    }
}

const sendMailRedirect = async (req, res, next) => {
    try
    {
        const { id } = req.params
        const userDB = await User.findById(id)
        const emailEnv = process.env.EMAIL
        const passwordEnv = process.env.PASSWORD


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailEnv,
                pass: passwordEnv
            }
        })
    
        const mailOptions = {
            from: emailEnv,
            to: userDB.email,
            subject: 'Confirm your account',
            text: `¡Holo! Tu cofigo es ${userDB.confirmationCode}, gracias por confiar en nosotros.`
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if(error)
                {
                    console.log(error)
                    return res.status(404).json({
                        user: userDB,
                        confirmationCode: 'error resend code'
                    })
                }
            else
                {
                    console.log('Email sent:' + info.response)	
                    return res.status(200).json({
                        user: userDB, 
                        confirmationCode: userDB.confirmationCode
                    })
                }
        })
    
    }
    catch (error)
    {
        return next(error)
    }
}

const checkNewUser = async (req, res, next) => {

    try 
    {
        const { email, confirmationCode } = req.body

        const userExists = await User.findOne({email})

        if(!userExists)
        {
            return res.status(404).json({message: 'User not found'})
        }
        else 
        {
            if( confirmationCode === userExists.confirmationCode)
            {
                try {
                    await userExists.updateOne({isVerified: true})
                    const updateUser = await User.findOne({email})

                    return res.status(200).json({
                        testCheckOk: updateUser.isVerified ? true : false
                    })
                }
                catch(error)
                {
                    return res.status(404).json(error.message)
                }
            }
            else {
                const deleteUser = await User.findByIdAndDelete(userExists._id)

                return res.status(200).json({
                    userExists,
                    check:false,
                    delete: (await User.findById(userExists._id)) ? 'error deleting user' : 'user deleted'
                })
            }
        }

    }
    catch(error)
    {
        return next(setError(500,'General error check code'))
    }

}

const resendCode = async (req, res, next) => {

    try {
        const email = process.env.EMAIL
        const pass = process.env.PASSWORD
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: pass
            }
        })

        const userExists = await User.findOne({email: req.body.email})

        if(userExists) {
            const mailOptions = {
                from: email,
                to: userExists.email,
                subject: 'Confirm your account',
                text: `¡Holo! Tu cofigo es ${userExists.confirmationCode}, gracias por confiar en nosotros.`
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if(error)
                    {
                        console.log(error)
                        return res.status(404).json({
                            user: userExists,
                            confirmationCode: 'error resend code'
                        })
                    }
                else
                    {
                        console.log('Email sent:' + info.response)	
                        return res.status(200).json({
                            user: userExists, 
                            confirmationCode: userExists.confirmationCode
                        })
                    }
            })
        }
        else 
        {
            return res.status(404).json({message: 'User not found'})
        }
    }
    catch(error)
    {
        return next(error)
    }


}

const loginUser = async (req, res, next) => {

    try {
        const { email, password } = req.body
        const userDB = await User.findOne({email})

        if(userDB)
        {
            if(bcrypt.compareSync(password, userDB.password))
            {
                const token = generateToken(userDB._id,email)
                req.user = userDB._id
                res.status(200).json({
                    user: {
                        id: userDB._id,
                        email,
                        username: userDB.username
                    },
                    token
                })
            }
            else 
            {
                return res.status(404).json({message: 'Password not valid'})
            }
        }
        else 
        {
            return res.status(404).json({message: 'User not found'})
        }
    }
    catch(error)
    {
        return next(error)
    }

}

const getUserByUsername = async (req, res, next) => {

    try {
        const { username } = req.params
        const userFound = await User.findOne({username})
        if(userFound)
            return res.status(200).json(userFound)
        else
            return res.status(404).json({message: 'User not found'})
    }
    catch(error)
    {
        return next(error)
    }

}

const modifyPassword = async (req, res, next) => {

    try {
        const userToChangePass = await User.findById(req.user._id)
        const { oldPassword, newPassword } = req.body

        if(userToChangePass) {
            if(bcrypt.compareSync(oldPassword, userToChangePass.password))
            {
                const newPasswordHash = await bcrypt.hash(newPassword, 10)
                const userUpdated = await User.findByIdAndUpdate(req.user._id, {password: newPasswordHash})

                if (bcrypt.compareSync(newPassword, userUpdated.password))
                {
                    return res.status(200).json({
                        updateUser: true,
                        sendPassword: false
                    })
                }
                else 
                {
                    return res.status(404).json({
                        updateUser: false,
                        sendPassword: false
                    })
                }
            }
            else 
            {
                return res.status(404).json({message: 'Password not valid'})
            }
        }
    }
    catch(error)
    {
        return next(error)
    }


}

const updateUser = async (req, res, next) => {

    try {
        const { id } = req.params
        const {email, username, password, name, surname, avatar} = req.body

        const userToUpdate = await User.findById(id)

        if(userToUpdate)
        {
            const newContents = {
                email: email || userToUpdate.email,
                username: username || userToUpdate.username,
                password: password || userToUpdate.password,
                name: name || userToUpdate.name,
                surname: surname || userToUpdate.surname,
                avatar: avatar || userToUpdate.avatar
            }
            if(userToUpdate.avatar)
            {
                userToUpdate.avatarImg = `https://api.dicebear.com/6.x/avataaars/svg?seed=${newContents.avatar}&backgroundType=gradientLinear&backgroundColor=ffdf66&style=circle`
            }
        
            const userUpdated = await User.findByIdAndUpdate(id, newContents)
            return res.status(200).json({newContents})
        }
        else {
            return res.status(404).json({message: 'User not found'})
        }
    }
    catch (error)
    {
        return next(error)
    }


}


const changePassword = async (req, res, next) => {
    try {
        const { email } = req.body

        const userDb = await User.findOne({email})

        if (userDb){
            console.log('dentro')
            return res.redirect(307, `${PROTOCOL}${HOST}:${PORT}${ENDPOINT}/users/sendPassword/${userDb._id}`)
    }              
        else 
        {
            return res.status(404).json({message: 'User not found'})
        }
    }
    catch(error)
    {
        return next(error)
    }
}

const sendPassword = async (req, res, next) => {

    try {
        const { id } = req.params
        const userDb = await User.findById(id)

        const email = process.env.EMAIL
        const pass = process.env.PASSWORD
        const transporter = nodemailer.createTransport({
            
            service: 'gmail',
            auth: {
                user: email,
                pass: pass
            }
        
        })
    
        const newPassword = randomPassword()

        const mailOptions = {
            
            from: email,
            to: userDb.email,
            subject: 'New password',
            text: `¡Holo! Tu nueva contraseña es ${newPassword}, gracias por confiar en nosotros.`
        
        }

        transporter.sendMail(mailOptions, async (error, info) => {

            if(error){
                return res.status(404).json('Email not sent')
            }
            else 
            {
                try 
                {
                    const newPasswordHash = await bcrypt.hash(newPassword, 10)
                    
                    await User.findByIdAndUpdate(id, {password: newPasswordHash})

                    const userUpdated = await User.findById(id)

                    if (bcrypt.compareSync(newPassword, userUpdated.password))
                    {
                        return res.status(200).json({
                            updateUser: true,
                            sendPassword: true
                        })
                    }
                    else 
                    {
                        return res.status(404).json({
                            updateUser: false,
                            sendPassword: true
                        })
                    }
                }
                catch(error)
                {
                    return next(error)
                }
                

            }


        })
    
    }
    catch(error)
    {
        return next(error)
    }

}

const deleteUser = async (req, res, next) => {

    try
    {
        const { id } = req.params

        const userDeleted = await User.findByIdAndDelete(id)

        if(userDeleted)
        {
            return res.status(200).json({message: 'User deleted'})
        }
        else 
        {
            return res.status(404).json({message: 'User not found'})
        }
    }
    catch(error)
    {
        return next(error)
    }


}

module.exports = {
    getUser,
    getAllUsers,
    getUserByUsername,
    updateUser,
    registerUser,
    sendMailRedirect,
    checkNewUser,
    loginUser,
    modifyPassword,
    sendPassword,
    changePassword,
    deleteUser

}