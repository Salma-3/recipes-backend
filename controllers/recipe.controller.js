const Recipe = require('../models/Recipe')
const {deleteImageById} = require('../controllers/image.controller')
const DEFAULT_LIMIT = 20
require('util').inspect.defaultOptions.depth = null
const slugify = require('slugify')
const mongoose = require('mongoose')



const recipeById = async (req, res, next, id) => {
    try {
        let prop = mongoose.Types.ObjectId.isValid(id) ? '_id' : 'slug'
        
        
        const recipe = await Recipe.findOne({[prop]: id})
        .populate('image category')
        .populate({path: 'author', select: 'name email social avatar description bio'})
        .populate({path: 'author', populate: 'avatar'})

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
        const {name, tags, category, image, quantity, time, ingredients, instructions, description} = req.body

        const recipe = new Recipe({
            name,
            author: req.user.id,
            category,
            tags, 
            image, 
            quantity, 
            description,
            time, 
            ingredients,
            instructions,
            slug: slugify(name).toLowerCase() + `-${new Date().getTime()}`
        })

        await recipe.save()

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
        const limit = req.query.limit || DEFAULT_LIMIT;
        const sort = req.query.sort || 'name'
        const page = +req.query.page || 1
        const sortObj = {[sort[0] === '-' ? sort.substr(1, sort.length -1) : sort]: sort[0] === '-' ? -1 : 1}
       // console.log(sortObj)

        const queryObj = {}

        if(req.query.category) queryObj.category = req.query.category;

        if(req.query.keyword) {
            const rgx = `.*${req.query.keyword}.*`
            const exp = new RegExp('.*'+req.query.keyword+'.*')
            queryObj['$or'] = [{
                name: {$regex: rgx, $options: 'i'}
            }, {
            tags:  {$in: [exp]}
            }]
        }

       // console.log(queryObj)

        let recipes;

        if(limit === 'all'){
            recipes = await Recipe.find(queryObj).sort(sortObj).populate('image category').populate({path: 'author', select: 'name email social avatar description bio'});
        }else{
            const offset = (page - 1) * limit;

            recipes = await Recipe.find(queryObj).sort(sortObj).skip(offset).limit(parseInt(limit)).populate('image category').populate({path: 'author', select: 'name email social avatar description bio'})
        }


        const total = await Recipe.countDocuments(queryObj)

        return res.status(200).json({recipes, page, total})
    } catch (err) {
        res.status(500).json({errors: [{msg: err.message}]}) 
    }
}


const deleteOne = async (req, res) => {
    try {
        await Recipe.deleteOne({_id: req.recipe._id})
        await deleteImageById(req.recipe.image._id)

        return res.status(204).json('Deleted')
    } catch (err) {
        res.status(500).json({errors: [{msg: err.message}]}) 
    }
}


// retrieve recipes by author/owner

const recipesByOwner = async (req, res) => {
    try {
        const limit = req.query.limit || DEFAULT_LIMIT;
        const sort = req.query.sort || 'name'
        const page = +req.query.page || 1
        const sortObj = {[sort[0] === '-' ? sort.substr(1, sort.length -1) : sort]: sort[0] === '-' ? -1 : 1}
       // console.log(sortObj)

        const queryObj = {
            author: req.user.id
        }

        if(req.query.category) queryObj.category = req.query.category;

        if(req.query.keyword) {
            const rgx = `.*${req.query.keyword}.*`
            const exp = new RegExp('.*'+req.query.keyword+'.*')
            queryObj['$or'] = [{
                name: {$regex: rgx, $options: 'i'}
            }, {
            tags:  {$in: [exp]}
            }]
        }

        //console.log(queryObj)

        let recipes;

        if(limit === 'all'){
            recipes = await Recipe.find(queryObj).sort(sortObj).populate('image category').populate({path: 'author', select: 'name email social avatar description bio'});
        }else{
            const offset = (page - 1) * limit;

            recipes = await Recipe.find(queryObj).sort(sortObj).skip(offset).limit(parseInt(limit)).populate('image category').populate({path: 'author', select: 'name email social avatar description bio'})
        }

        const total = await Recipe.countDocuments(queryObj)

        return res.status(200).json({recipes, page, total})
    } catch (err) {
        res.status(500).json({errors: [{msg: err.message}]}) 

    }
}


const update = async (req, res) => {
    try {
        let slug = (!req.body.name || req.recipe.name === req.body.name ) ? req.recipe.slug : slugify(req.body.name).toLowerCase() + `-${new Date().getTime()}`
        const recipe = await Recipe.findByIdAndUpdate(req.recipe._id, {...req.body, slug}, {new: true})
        .populate('image category')
        .populate({path: 'author', select: 'name email social avatar description bio'})
        .populate({path: 'author', populate: 'avatar'})

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

