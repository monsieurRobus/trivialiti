const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,            
        },
        description: {
            type: String,

        },
        color: {
            type: String,

        },
        questions: [{
            type: mongoose.Types.ObjectId,
            ref: 'Question'
        }],
        user: {
            type: mongoose.Types.ObjectId,
            reef: 'User'
        }

    },
    {
        timestamps: true,
    })

const Category = mongoose.model('Category', CategorySchema)

module.exports = Category

