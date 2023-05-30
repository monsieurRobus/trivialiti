const express = require('express')
const router = express.Router()
const Question = require('../models/Question.model')
const Category = require('../models/Category.model')

router.post('/new', async (req,res,next)=> { 

    try 
        {
            const question = new Question(req.body)

            question.category.forEach(async (categoryId) => {

                const category = await Category.findById(categoryId)
                category.questions.push(question._id)
                await category.save()

            })

            const createdQuestion = await question.save()




            return createdQuestion ? res.status(200).json(createdQuestion) : res.status(404).json({message: "❌ Error creating question"})

        }
    catch(error)
        {
            return next(error)
            
        }


})

router.get('/', async(req,res,next) => {

    try 
        {
            const questions = await Question.find()
            return questions ? res.status(200).json(questions) : res.status(404).json({message: "❌ Error getting questions"})
        }
    catch(error)
        {
            return next(error)
        }

})

router.get('/question', async(req,res,next) => {

    try 
        {
            const questions = await Question.find({question: req.body.question})
            return questions ? res.status(200).json(questions) : res.status(404).json({message: "❌ Error getting questions"})
        }
    catch(error)
        {
            return next(error)
        }

})

module.exports = router