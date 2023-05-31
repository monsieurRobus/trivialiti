const { randomCode } = require('../../utils/randomCode')
const bcrypt = require('bcrypt')
require('dotenv').config()
const User = require('../../models/User.model')
const { generateToken } = require('../../utils/token')
const { sendEmail } = require('../../utils/sendEmail')
const nodemailer = require('nodemailer')
const randomPassword = require('../../utils/randomPassword')

const registerUser = async (req, res, next) => {
    
}