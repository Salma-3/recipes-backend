const {uploadFile, deleteFile} = require('./cloudinary')
const fs = require('fs')

const Image = require('../models/Image')

const create = async (image, options = {})=> {
    
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

        if(options.deleteAfter){
            fs.unlinkSync(image.path)
        }

        return img;
    
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