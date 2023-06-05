const Question = require('../models/Question.model')
const Category = require('../models/Category.model')
const User = require('../models/User.model')
const postNewQuestion = async (req,res,next)=> { 

    try 
        {
            const question = new Question({...req.body,user: req.user._id})

            const user = await User.findById(req.user._id)

            if (user) {
                user.questions.push(question._id)
                await user.save()
            }
            else {
                return res.status(404).json({message: "❌ User not found"})
            }

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

            question.questionsRelated.forEach(async (questionId) => {

                const questionRelated = await Question.findById(questionId)
                if (questionRelated)
                {
                    questionRelated.questionsRelated.push(question._id)
                    await questionRelated.save()
                }
                else 
                {
                    console.log(`❌ Question ${questionId} not found, not adding question to questionRelated`)
                    await question.updateOne({$pull: {questionsRelated: questionId}})
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
            const {questionId} = req.params
            const questions = await Question.findById(questionId)
            return questions ? res.status(200).json(questions) : res.status(404).json({message: "❌ Error getting questions"})
        }
    catch(error)
        {
            return next(error)
        }

}

const updateQuestionById = async(req,res,next) => {

    try 
    {   
        const {questionId} = req.params
        const questionToUpdate = await Question.findById(questionId)
        const {question, answers, category, user, language} = req.body

        const questionUpdated = {
            question: question || questionToUpdate.question,
            answers: answers || questionToUpdate.answers,
            category: category || questionToUpdate.category,
            user: user || questionToUpdate.user,
            language: language || questionToUpdate.language
        }

        try 
        {
            const question = await Question.findByIdAndUpdate(questionId, questionUpdated)
            return question ? res.status(200).json(questionUpdated) : res.status(404).json({message: "❌ Error updating question"})
        }
        catch (error)
        {
            return res.status(404).json({message: "❌ Error updating question"})
        }


    }
    catch (error)
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

            await Category.updateMany({questions: questionId}, {$pull: {questions: questionId}})
            await Question.updateMany({questionsRelated: questionId}, {$pull: {questionsRelated: questionId}})
            await User.updateMany({questions: questionId}, {$pull: {questions: questionId}})

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
    getQuestionsByCategoryName,
    updateQuestionById 
}