const router = require('express').Router()
const ctrl = require('../controllers/image.controller')
const validate = require('../middleware/validate')
const {check} = require('express-validator')
const auth = require('../middleware/auth')
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

router.post('/', [
    upload.single('image'),
    auth
], ctrl.create)


module.exports = router