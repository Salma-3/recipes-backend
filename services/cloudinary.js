const config = require('config')
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: config.get('CLOUDINARY_CLOUD_NAME'),
    api_key: config.get('CLOUDINARY_API_KEY'),
    api_secret: config.get('CLOUDINARY_API_SECRET')
})


const uploadFile = (path='/sample1.jpeg') => {
    return new Promise((resolve, reject)=> {
        cloudinary.uploader.upload(path, function(error, result){
            if(error) return reject(error)
            else resolve(result)
        })
    })
}


const deleteFile = (publicId) => {
  return new Promise((resolve, reject)=> {
      cloudinary.uploader.destroy(publicId, {}, (err, result)=> {
          if(err) return reject(err)
          else return resolve(result)
      })
  })
}

module.exports = {
    uploadFile, 
    deleteFile
}