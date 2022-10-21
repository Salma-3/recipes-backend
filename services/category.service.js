const Category = require('../models/Category')
const {deleteImageById} = require('./image.service')


const DEFAULT_LIMIT = 20


const create = async (image, name)=> {
   
    cat  = new Category({name, image})
    await cat.save()

    return cat
}


const list = async (query) => {
    
    const sort = query.sort || 'name'
    const limit = query.limit || DEFAULT_LIMIT
    const page = +query.page || 1
    const offset = (page - 1) * limit;

    const sortObj = {[sort[0] === '-' ? sort.substr(1, sort.length -1) : sort]: sort[0] === '-' ? -1 : 1};
    let categories;

    if(limit === 'all'){
        categories = await Category.find().sort(sortObj).populate('image')
    }else{
        categories = await Category.find().sort(sortObj).skip(offset).limit(parseInt(limit)).populate('image')
    }

    return {categories, page} 
}

const update = async (id, name, image)=> {
   
    const category = await Category.findByIdAndUpdate(id, {name, image}, {new: true});
    return category
}



const deleteOne = async (id, imageId)=> {
    await Category.findByIdAndDelete(id)

    //delete associated image
    await deleteImageById(imageId)

    return
}




module.exports = {create, list, deleteOne, update}