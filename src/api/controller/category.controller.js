const Category = require('../models/Category.model')
const Question = require('../models/Question.model')

const postNewCategory = async (req,res,next)=> {

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


}

const getAllCategories = async(req,res,next) => {

    try {
            const categories = await Category.find()
            return categories ? res.status(200).json(categories) : res.status(404).json({message: "❌ Error getting categories"})
        }
    catch(error)
        {
            next(error)
        }


}

const getCategoryById = async(req,res,next) => {
    try {
            const {categoryId} = req.params
            const category = await Category.findById(categoryId)

            return category ? res.status(200).json(category) : res.status(404).json({message: "❌ Error getting category"})
        }
    catch(error)
        {
            next(error)
        }
}

const getCategoryByName = async(req,res,next) => {

    try 
    {
        const {categoryName} = req.params
        const category = await Category.findOne({name: categoryName})
        return category ? res.status(200).json(category) : res.status(404).json({message: "❌ Error getting category"})
    }
    catch(error)
    {   
        next(error)
    }

}

const deleteCategoryById = async(req,res,next) => {

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

        if(categoryToDelete) 
            {
                // Borramos la categoría de cada una de las preguntas en las que aparece
                await Question.updateMany({category: categoryId}, {$pull: {category: categoryId}})

                return res.status(200).json(
                        {
                            finally: "✔️ Category deleted",
                            deletedEvent: deleteEvent,
                            test: 
                                (await Category.findById(categoryId) === null) ? "✔️ Category deleted" : "❌ Error deleting category" 
                        
                        }
                    )
            }
        else 
            {
                return res.status(404).json("❌ Error deleting category, no category found")
            }


        return categoryToDelete ? res.status(200).json(saveDelete) : res.status(404).json({message: "❌ Error deleting category"})
}
    catch (error)
    {
        return next(error)
    }
}

module.exports = { 
    postNewCategory, 
    getAllCategories,
    getCategoryByName,
    getCategoryById, 
    deleteCategoryById 
}