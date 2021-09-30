const multer = require('multer')

const multerStorage = multer.diskStorage({
    destination: './tmp',
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `admin-${file.fieldname}-${Date.now()}.${ext}`);
    }
})

const upload = multer({
   storage: multerStorage
})


module.exports = upload