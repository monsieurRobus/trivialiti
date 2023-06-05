const express = require('express')
const router = express.Router()
const { isAuth, isAdmin } = require('../../middlewares/auth.middleware')
const { postNewCategory, getCategoryById ,getCategoryByName, getAllCategories, deleteCategoryById, updateCategoryById } = require('../controller/category.controller')
const Question = require('../models/Question.model')
const Category = require('../models/Category.model')



router.post('/new', isAuth,postNewCategory )
router.get('/', getAllCategories )
router.get('/:categoryId', getCategoryById )
router.patch('/update/:categoryId',isAuth, updateCategoryById )
router.get('/name/:categoryName', getCategoryByName )
router.delete('/delete/:categoryId',isAuth,isAdmin, deleteCategoryById )

module.exports = router