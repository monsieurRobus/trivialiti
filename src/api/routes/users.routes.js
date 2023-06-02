const express = require('express')
const router = express.Router()
const { isAuth, isAdmin } = require('../../middlewares/auth.middleware')
const { sendMailRedirect, registerUser, checkNewUser, loginUser, changePassword, sendPassword } = require('../controller/user.controller')

router.get('/register', registerUser)
router.get('/register/sendMail/:id', sendMailRedirect)
router.post('/check', checkNewUser)
router.post('/login', loginUser)
router.get('/changePassword',changePassword)
router.get('/sendPassword/:id', sendPassword)

module.exports = router