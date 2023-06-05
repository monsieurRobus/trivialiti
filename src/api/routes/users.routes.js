const express = require('express')
const router = express.Router()
const { isAuth, isAdmin } = require('../../middlewares/auth.middleware')
const { sendMailRedirect, registerUser, checkNewUser, loginUser, modifyPassword, changePassword, sendPassword,deleteUser, getUser, getAllUsers,getUserByUsername,updateUser } = require('../controller/user.controller')

router.get('/register', registerUser)
router.get('/id/:id',isAuth,getUser)
router.get('/username/:username',isAuth,getUserByUsername)
router.get('/list', isAuth, getAllUsers)
router.patch('/user/update/:id',isAuth,isAdmin, updateUser)
router.get('/register/sendMail/:id', sendMailRedirect)
router.post('/check', checkNewUser)
router.post('/login', loginUser)
router.post('/modifyPassword',isAuth,modifyPassword)
router.get('/changePassword',changePassword)
router.get('/sendPassword/:id', sendPassword)
router.delete('/delete/:id',isAuth,isAdmin, deleteUser)

module.exports = router