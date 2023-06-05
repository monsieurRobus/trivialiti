const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const UserSchema = new mongoose.Schema(
    { 
        username: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String
        },
        surname: {
            type: String
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate: [validator.isEmail, 'Email not valid']
        },
        password: {
            type:String,
            required: true,
            trim:true,
            validate: [validator.isStrongPassword, 'Password not valid'],
            minlength: [8,'Min 8 characters']

        },
        avatar: {
            type: String,
            default: 'random',

        },
        confirmationCode: {
            type: String
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        questions: [{
            type: mongoose.Schema.Types.ObjectId,
        }],
        categories: [{
            type: mongoose.Schema.Types.ObjectId,
        }],

    },
    {
        timestamps: true,
    })


    UserSchema.pre('save', async function(next) {
        try 
        {
            this.password = await bcrypt.hash(this.password, 10)
            next()
        }
        catch (error)
        {
            next("Error hashing password",error)
        }
    })



const User = mongoose.model('User', UserSchema)

module.exports = User