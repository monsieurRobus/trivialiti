const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
    question: {
        type: String, 
        required: true,
        unique: true,

    },

    language: {
        type: String,
        required: true,
        enum: ['en', 'es', 'it', 'pt']
    },

    answers: [{
        answer: {
            type: String,
            required: true,
        },
        isCorrect: {
            type: Boolean,
            required: true,
        }
    }],

    category: [{
        type: mongoose.Types.ObjectId,
        ref: 'Category'
    }],
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    questionsRelated: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Question'
        }
    ] 
})

const Question = mongoose.model('Question', QuestionSchema)

module.exports = Question