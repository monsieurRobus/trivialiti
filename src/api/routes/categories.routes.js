const express = require('express')
const router = express.Router()
const Category = require('../models/Category.model')
const Question = require('../models/Question.model')

router.post('/', async (req,res,next)=> {

    try
        {
            const category = new Category(req.body)
            const createdCategory = await category.save()
            return createdCategory ? res.status(200).json(createdCategory) : res.status(404).json({message: "❌ Error creating category"})
        }
    catch (error)
        {
            return next(error)
        }


})

router.get('/', async(req,res,next) => {

    try {
            const categories = await Category.find()
            return categories ? res.status(200).json(categories) : res.status(404).json({message: "❌ Error getting categories"})
        }
    catch(error)
        {
            next(error)
        }


})

router.get('/:categoryId', async(req,res,next) => {
    try {
            const {categoryId} = req.params
            const category = await Category.findById(categoryId)

            return category ? res.status(200).json(category) : res.status(404).json({message: "❌ Error getting category"})
        }
    catch(error)
        {
            next(error)
        }
})


router.delete('/delete/:categoryId', async(req,res,next) => {

    try {
        const {categoryId} = req.params
        const categoryToDelete = await Category.findByIdAndDelete(categoryId)

        
        const saveDelete = {
            name: categoryToDelete.name,
            description: categoryToDelete.description,
            color: categoryToDelete.color,
            questions: categoryToDelete.questions,
            user: categoryToDelete.user
        }


        if (categoryToDelete) {


            categoryToDelete.questions.forEach(async (question, index) => {
                try {
                    const question = await Question.findById(question._id)
                    const indexToDelete = question.category.indexof(categoryId)
                    question.category.splice(indexToDelete, 1)
                    question.save()
                    return res.status(200).json({status: "✔️ Category deleted" })

                }
                catch (error)
                {
                    try
                        {
                            const newCategory = {
                                name: saveDelete.name,
                                description: saveDelete.description,
                                color: saveDelete.color,
                                questions: saveDelete.questions,
                                user: saveDelete.user
                            }

                            const newCategoryClone = new Category(newCategory)

                            newCategoryClone._id = categoryId

                            await newCategoryClone.save()

                            return res.status(500).json({status: "❌ Error deleting category, but we have restored it" })
                        }
                    catch (error)
                        {
                            return res.status(500).json({status: "❌ Error deleting category: no category to delete!" })
                            
                        }
                }
            })

            return res.status(200).json({
                categoryToDelete,
                test: (await Category.findById(categoryId) === null ? "Category deleted" : "Category not deleted")
                })

        }
        else {
            return res.status(404).json({status: "❌ Error deleting category"})
        }

    }

    catch(error) {
        return res.status(500).json({status: "❌ Error deleting category: no category to delete!" })
    }
})

module.exports = router