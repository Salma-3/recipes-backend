const Category = require('../models/Category')

const categoryService = require('../services/category.service')

const categoryById = async (req, res, next, id)=> {
   try {
       const cat = await Category.findById(id).populate('image')
       if(!cat){
           return res.status(404).json({errors: [{msg: 'Not Found'}]})
       }

       req.category = cat;
       next()
   } catch (err) {
    res.status(500).json({error: [{msg: err.message}]})
   }
}

const create = async (req, res)=> {
    try {
        const {image, name} = req.body;

        let cat = await Category.findOne({name});
        if(cat){
            
            return res.status(400).json({error: [{msg: 'The category is already exist'}]})
        }

        cat  = await categoryService.create(image, name)

        return res.status(201).json(cat)
    } catch (err) {
        res.status(500).json({error: [{msg: err.message}]})
    }
}


const get = async (req, res) => {
    return res.status(200).json(req.category)
}

const list = async (req, res)=> {
    try {
      const {categories, page} = await categoryService.list(req.query)

      return res.status(200).json({categories, page})

    } catch (err) {
        res.status(500).json({error: [{msg: err.message}]})

    }
}

const update = async (req, res)=> {
    try {
        const {name, image} = req.body;
        
        const category = await categoryService.update(req.category._id, name, image)

        res.status(200).json(category)
    } catch (err) {
        return res.status(500).json({errors: [{msg: err.message}]})
    }
}



const deleteOne = async (req, res)=> {
    try {
        await categoryService.deleteOne(req.params.id, req.category.image.id)

        res.status(200).json('Deleted')
    } catch (err) {
        res.status(500).json({error: [{msg: err.message}]})
    }
}




module.exports = {create, list, get, deleteOne, categoryById, update}