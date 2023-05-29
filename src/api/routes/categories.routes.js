const express = require('express')
const router = express.Router()
const Category = require('../models/Category.model')

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
    catch(error) {
        next(error)
    }


})

router.get('/:categoryId', async(req,res,next) => { 
    try {
        const {categoryId} = req.params
        const category = await Category.findById(categoryId)

        return category ? res.status(200).json(category) : res.status(404).json({message: "❌ Error getting category"})
    } 
    catch(error) {

        next(error)

    } })

module.exports = router