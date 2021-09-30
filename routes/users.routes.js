const router = require('express').Router()
const {check} = require('express-validator')
const ctrl = require('../controllers/users.controller')
const validate = require('../middleware/validate')
const auth = require('../middleware/auth')
const multer = require('../config/multer')

router.post('/', [
    check('name', 'Invalid name').isString().isLength({min: 4}),
    check('email', 'Invalid e-mail').isEmail(),
    check('password', 'Invalid password').isString().not().isEmpty(),
    validate
], ctrl.create)

router.put('/', [
    check('bio', 'Invalid Bio').isString().optional({nullable: true}),
    check('description', 'Invalid description').isString().optional({nullable: true}),
    check('facebook', 'Invalid Fcebook URL').isURL().optional({nullable: true, checkFalsy: true}),
    check('twitter', 'Invalid Twitter URL').isURL().optional({nullable: true, checkFalsy: true}),
    check('instagram', 'Invalid Instagram').isURL().optional({nullable: true, checkFalsy: true}),
    validate,
    auth
], ctrl.update)


router.put('/upload', [
    auth,
    multer.single('image')
], ctrl.upload)


router.get('/', auth, ctrl.getCurrentUser)

router.get('/:name', ctrl.profile)
    

module.exports = router;