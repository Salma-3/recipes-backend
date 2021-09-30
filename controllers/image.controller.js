const {uploadFile, deleteFile} = require('../services/cloudinary')
const fs = require('fs')

const Image = require('../models/Image')

const create = async (req, res)=> {
    try {
        console.log(req.file)
        const image = req.file
       
        const result = await uploadFile(image.path)
        const img = new Image({
            public_id: result.public_id,
            images: [{
                width: result.width,
                height: result.height,
                url: result.secure_url,
                format: result.format
            }]
        })

        await img.save()

        fs.unlinkSync(image.path)

        res.status(201).json(img)
    } catch (err) {
        res.status(500).json({error: [{msg: err.message}]})
    }
}


const deleteImageById = (id)=> {
   return new Promise((resolve, reject)=> {
       Image.findById(id, {}, {}, (err, image)=> {
           if(err){
               return reject(err)
           }else{
               deleteFile(image.public_id).then(result => {
                  Image.deleteOne({_id: id}, {}, (e)=> {
                      if(e) return reject(e)
                      else return resolve(true)
                  })
               }).catch(error => {
                   return reject(error)
               })
           }
       })
   })
}


module.exports = {create, deleteImageById}