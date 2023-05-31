const express = require('express')
const router = express.Router()
const Question = require('../models/Question.model')
const { postNewQuestion, getAllQuestions, getQuestionById, deleteQuestionById, getQuestionsByCategoryName,updateQuestionById } = require('../controller/question.controller')
const Category = require('../models/Category.model')

router.post('/new', postNewQuestion)
router.get('/', getAllQuestions)
router.get('/question/:questionId', getQuestionById)
router.patch('/update/:questionId', updateQuestionById)
router.get('/category/name/:categoryName', getQuestionsByCategoryName)
router.delete('/delete/:questionId', deleteQuestionById)

module.exports = router