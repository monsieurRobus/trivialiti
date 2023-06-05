const express = require('express')
const router = express.Router()
const { isAuth, isAdmin } = require('../../middlewares/auth.middleware')
const { postNewQuestion, getAllQuestions, getQuestionById, deleteQuestionById, getQuestionsByCategoryName,updateQuestionById } = require('../controller/question.controller')
const Category = require('../models/Category.model')
const Question = require('../models/Question.model')

router.post('/new',isAuth, postNewQuestion)
router.get('/' , isAuth, getAllQuestions)
router.get('/question/:questionId', getQuestionById)
router.patch('/update/:questionId',isAuth, updateQuestionById)
router.get('/category/name/:categoryName',isAuth, getQuestionsByCategoryName)
router.delete('/delete/:questionId', isAuth, isAdmin, deleteQuestionById)

module.exports = router