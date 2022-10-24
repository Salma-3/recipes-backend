require('util').inspect.defaultOptions.depth = null

const recipeService = require('../services/recipe.service')



const recipeById = async (req, res, next, id) => {
    try {         
        const recipe = await recipeService.recipeById(id)

        if(!recipe){
            return res.status(404).json({errors: [{msg: 'Not Found'}]})
        }
        req.recipe = recipe;
        next()
    } catch (err) {
        res.status(500).json({errors: [{msg: err.message}]})
    }
}

const isAuthor = async (req, res, next) => {

   if(req.recipe.author._id.toString() === req.user.id){
       return next()
   }else{

       return res.status(401).json({errors: [{msg: 'Authorization Denied'}]})
   }
}

const create = async (req, res)=> {
    try {
        const recipe = await recipeService.create(req.body, req.user.id)

        return res.status(201).json(recipe)
    } catch (err) {
       res.status(500).json({errors: [{msg: err.message}]}) 
    }
}


const get = async (req, res) => {
    return res.status(200).json(req.recipe)
}



const list = async (req, res)=> {
    try {
        const { recipes, page, total } = await recipeService.list(req.query)

        return res.status(200).json({recipes, page, total})
    } catch (err) {
        res.status(500).json({errors: [{msg: err.message}]}) 
    }
}


const deleteOne = async (req, res) => {
    try {
        await recipeService.deleteOne(req.recipe._id, req.recipe.image._id)

        return res.status(204).json('Deleted')
    } catch (err) {
        res.status(500).json({errors: [{msg: err.message}]}) 
    }
}


// retrieve recipes by author/owner

const recipesByOwner = async (req, res) => {
    try {
        const {recipes, total, page} = await recipeService.recipesByOwner(req.user.id, req.query)

        return res.status(200).json({recipes, page, total})
    } catch (err) {
        res.status(500).json({errors: [{msg: err.message}]}) 

    }
}


const update = async (req, res) => {
    try {
        const recipe = await recipeService.update(req.recipe.id, req.recipe, req.body)

        res.status(200).json(recipe)
    } catch (err) {
        res.status(500).json({errors: [{msg: err.message}]}) 
    }
}



module.exports = {
    create,
    get,
    list, 
    deleteOne,
    recipeById,
    isAuthor,
    recipesByOwner,
    update
}

