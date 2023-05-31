const Question = require('../models/Question.model')
const Category = require('../models/Category.model')

const postNewQuestion = async (req,res,next)=> { 

    try 
        {
            const question = new Question(req.body)

            question.category.forEach(async (categoryId) => {

                
                const category = await Category.findById(categoryId)
                if (category)
                    {
                        category.questions.push(question._id)
                        await category.save()
                    }
                else 
                    {
                        console.log(`❌ Category ${categoryId} not found, not adding question to category`)
                        await question.updateOne({$pull: {category: categoryId}})
                    }
                

            })

            const createdQuestion = await question.save()

            return createdQuestion ? res.status(200).json(createdQuestion) : res.status(404).json({message: "❌ Error creating question"})

        }
    catch(error)
        {
            return next(error)
            
        }


}

const getAllQuestions = async(req,res,next) => {

    try 
        {
            const questions = await Question.find()
            return questions ? res.status(200).json(questions) : res.status(404).json({message: "❌ Error getting questions"})
        }
    catch(error)
        {
            return next(error)
        }

}

const getQuestionById = async(req,res,next) => {

    try 
        {
            const questions = await Question.find({question: req.body.question})
            return questions ? res.status(200).json(questions) : res.status(404).json({message: "❌ Error getting questions"})
        }
    catch(error)
        {
            return next(error)
        }

}

const deleteQuestionById = async(req,res,next) => {


    try {
        const {questionId} = req.params
        const questionToDelete = await Question.findByIdAndDelete(questionId)

        
        if (questionToDelete) 
        {

            const saveDelete = {
                question: questionToDelete.question,
                answers: questionToDelete.answer,
                category: questionToDelete.category,
                user: questionToDelete.user
            }

            return res.status(200).json({
                finally: "Deleted",
                saveDelete
            })
        }
        else 
        {
            return res.status(404).json({message: "❌ Error deleting question"})
        }   
    }
    catch (error)
    {
        return next(error)
    }


}

const getQuestionsByCategoryName = async(req,res,next) => {

    try {

        const {categoryName} = req.params

        const category = await Category.findOne({name: categoryName})
        const questionList = await Question.find({_id: {$in: category.questions} })
        
        return questionList ? res.status(200).json(questionList) : res.status(404).json({message: "❌ No questions to show"})

    }
    catch(error)
    {
        return next(error)
    }

}

module.exports = { 
    postNewQuestion, 
    getAllQuestions,
    getQuestionById,
    deleteQuestionById,
    getQuestionsByCategoryName 
}