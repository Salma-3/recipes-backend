const Recipe = require('../models/Recipe')
const {deleteImageById} = require('./image.service')

const DEFAULT_LIMIT = 20

require('util').inspect.defaultOptions.depth = null

const slugify = require('slugify')

const mongoose = require('mongoose')



const recipeById = async (id) => {
    
    let prop = mongoose.Types.ObjectId.isValid(id) ? '_id' : 'slug'
        
    const recipe = await Recipe.findOne({[prop]: id})
    .populate('image category')
    .populate({path: 'author', select: 'name email social avatar description bio'})
    .populate({path: 'author', populate: 'avatar'})

    return recipe;
}


const create = async (body, userId)=> {
    
    const {name, tags, category, image, quantity, time, ingredients, instructions, description} = body

    const recipe = new Recipe({
        name,
        author: userId,
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

    return recipe
    
}


const list = async (query)=> {
    
        const limit = query.limit || DEFAULT_LIMIT;
        const sort = query.sort || 'name'
        const page = +query.page || 1
        const sortObj = {[sort[0] === '-' ? sort.substr(1, sort.length -1) : sort]: sort[0] === '-' ? -1 : 1}

        const queryObj = {}

        if(query.category) queryObj.category = query.category;

        if(query.keyword) {
            const rgx = `.*${query.keyword}.*`
            const exp = new RegExp('.*'+query.keyword+'.*')
            queryObj['$or'] = [{
                name: {$regex: rgx, $options: 'i'}
            }, {
            tags:  {$in: [exp]}
            }]
        }

        let recipes;

        if(limit === 'all'){
            recipes = await Recipe.find(queryObj).sort(sortObj).populate('image category').populate({path: 'author', select: 'name email social avatar description bio'});
        }else{
            const offset = (page - 1) * limit;

            recipes = await Recipe.find(queryObj).sort(sortObj).skip(offset).limit(parseInt(limit)).populate('image category').populate({path: 'author', select: 'name email social avatar description bio'})
        }


        const total = await Recipe.countDocuments(queryObj)

        return {recipes, page, total}
   
}


const deleteOne = async (id, imageId) => {
   
    await Recipe.deleteOne({_id: id})
    await deleteImageById(imageId)

    return ;
   
}


// retrieve recipes by author/owner

const recipesByOwner = async (userId, query) => {
    const limit = query.limit || DEFAULT_LIMIT;
    const sort = query.sort || 'name'
    const page = +query.page || 1
    const sortObj = { [sort[0] === '-' ? sort.substr(1, sort.length - 1) : sort]: sort[0] === '-' ? -1 : 1 }
    // console.log(sortObj)

    const queryObj = {
        author: userId
    }

    if (query.category) queryObj.category = query.category;

    if (query.keyword) {
        const rgx = `.*${query.keyword}.*`
        const exp = new RegExp('.*' + query.keyword + '.*')
        queryObj['$or'] = [{
            name: { $regex: rgx, $options: 'i' }
        }, {
            tags: { $in: [exp] }
        }]
    }

    let recipes;

    if (limit === 'all') {
        recipes = await Recipe.find(queryObj).sort(sortObj).populate('image category').populate({ path: 'author', select: 'name email social avatar description bio' });
    } else {
        const offset = (page - 1) * limit;

        recipes = await Recipe.find(queryObj).sort(sortObj).skip(offset).limit(parseInt(limit)).populate('image category').populate({ path: 'author', select: 'name email social avatar description bio' })
    }

    const total = await Recipe.countDocuments(queryObj)

    return { recipes, page, total }

}


const update = async (id, rcp = null , body) => {
    var recipe = !rcp ?  await Recipe.findById(id) : rcp
    let slug = (!body.name || recipe.name === body.name) ? recipe.slug : slugify(body.name).toLowerCase() + `-${new Date().getTime()}`
    
    recipe = await Recipe.updateOne({_id: id}, { ...body, slug }, { new: true })
        .populate('image category')
        .populate({ path: 'author', select: 'name email social avatar description bio' })
        .populate({ path: 'author', populate: 'avatar' })

    return recipe;


}



module.exports = {
    create,
    list, 
    deleteOne,
    recipeById,
    recipesByOwner,
    update
}

