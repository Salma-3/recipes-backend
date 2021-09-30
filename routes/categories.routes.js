const router = require('express').Router()
const {check} = require('express-validator')
const ctrl = require('../controllers/category.controller')
const validate = require('../middleware/validate')
const auth = require('../middleware/auth')


router.post('/', [
    check('name', 'Invalid name').isString().isLength({min: 4}),
    check('image', 'Invalid image id').isMongoId(),
    validate,
    auth
], ctrl.create)


router.put('/:id', [
    check('name', 'Invalid name').isString().isLength({min: 4}),
    check('image', 'Invalid image id').isMongoId(),
    validate,
    auth
], ctrl.update)

router.get('/', ctrl.list)

router.get('/:id', ctrl.get)

router.delete('/:id', auth, ctrl.deleteOne)

router.param('id', ctrl.categoryById)

    

module.exports = router;