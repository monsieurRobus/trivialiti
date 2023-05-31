const express = require('express')
const router = express.Router()
const Category = require('../models/Category.model')
const { postNewCategory, getCategoryById ,getCategoryByName, getAllCategories, deleteCategoryById, updateCategoryById } = require('../controller/category.controller')
const Question = require('../models/Question.model')



router.post('/', postNewCategory )
router.get('/', getAllCategories )
router.get('/:categoryId', getCategoryById )
router.patch('/update/:categoryId', updateCategoryById )
router.get('/name/:categoryName', getCategoryByName )
router.delete('/delete/:categoryId', deleteCategoryById )

module.exports = router