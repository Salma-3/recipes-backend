const Category = require('../models/Category')
const {deleteImageById} = require('../controllers/image.controller')


const DEFAULT_LIMIT = 20

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

        cat  = new Category({name, image})
        await cat.save()

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
      const sort = req.query.sort || 'name'
      const limit = req.query.limit || DEFAULT_LIMIT
      const page = +req.query.page || 1
      const offset = (page - 1) * limit;

      const sortObj = {[sort[0] === '-' ? sort.substr(1, sort.length -1) : sort]: sort[0] === '-' ? -1 : 1};
      //console.log(sortObj)
      let categories;

      if(limit === 'all'){
           categories = await Category.find().sort(sortObj).populate('image')
      }else{
          categories = await Category.find().sort(sortObj).skip(offset).limit(parseInt(limit)).populate('image')
      }

      return res.status(200).json({categories, page})

    } catch (err) {
        res.status(500).json({error: [{msg: err.message}]})

    }
}

const update = async (req, res)=> {
    try {
        const {name, image} = req.body;
        const category = await Category.findByIdAndUpdate(req.category._id, {name, image}, {new: true});

        res.status(200).json(category)
    } catch (err) {
        return res.status(500).json({errors: [{msg: err.message}]})
    }
}



const deleteOne = async (req, res)=> {
    try {
        await Category.findByIdAndDelete(req.category._id)

        //delete associated image
        await deleteImageById(req.category.image._id)

        res.status(200).json('Deleted')
    } catch (err) {
        res.status(500).json({error: [{msg: err.message}]})
    }
}




module.exports = {create, list, get, deleteOne, categoryById, update}