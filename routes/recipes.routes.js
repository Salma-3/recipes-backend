const router = require('express').Router()
const {check} = require('express-validator')
const ctrl = require('../controllers/recipe.controller')
const validate = require('../middleware/validate')
const auth = require('../middleware/auth')


router.post('/', [
    check('name', 'Invalid name').isString().isLength({min: 4}),
    check('image', 'Invalid image id').isMongoId(),
    check('category', 'Invalid category').isMongoId(),
    check('tags', 'Invalid tags').isArray().toArray(),
    check('quantity', 'Invalid quantity').isString().not().isEmpty(),
    check('time', 'Invalid time').isString().not().isEmpty(),
    check('description', 'Invalid description').isString().not().isEmpty(),
    check('ingredients', 'Invalid ingredients').isArray().toArray(),
    check('instructions', 'Invalid instructions').isArray().toArray(),
    check('ingredients.*.item', 'Invalid ingredient item').isString().not().isEmpty(),
    check('ingredients.*.item_id', 'Invalid ingredient id').isUUID(),
    check('instructions.*.item', 'Invalid instruction item').isString().not().isEmpty(),
    check('instructions.*.item_id', 'Invalid instruction id').isUUID(),
    validate,
    auth
], ctrl.create)


router.put('/:id', [
    check('name', 'Invalid name').isString().isLength({min: 4}).optional({nullable: true}),
    check('image', 'Invalid image id').isMongoId().optional({nullable: true}),
    check('category', 'Invalid category').isMongoId().optional({nullable: true}),
    check('tags', 'Invalid tags').isArray().toArray().optional({nullable: true}),
    check('quantity', 'Invalid quantity').isString().not().isEmpty().optional({nullable: true}),
    check('time', 'Invalid time').isString().not().isEmpty().optional({nullable: true}),
    check('description', 'Invalid description').isString().not().isEmpty().optional({nullable: true}),
    check('ingredients', 'Invalid ingredients').isArray().toArray().optional({nullable: true}),
    check('instructions', 'Invalid instructions').isArray().toArray().optional({nullable: true}),
    check('ingredients.*.item', 'Invalid ingredient item').isString().not().isEmpty().optional({nullable: true}),
    check('ingredients.*.item_id', 'Invalid ingredient id').isUUID().optional({nullable: true}),
    check('instructions.*.item', 'Invalid instruction item').isString().not().isEmpty().optional({nullable: true}),
    check('instructions.*.item_id', 'Invalid instruction id').isUUID().optional({nullable: true}),
    validate,
    auth,
    ctrl.isAuthor
], ctrl.update)




router.get('/', ctrl.list)

router.get('/me', auth, ctrl.recipesByOwner)

router.get('/:id', ctrl.get)

router.delete('/:id', [auth, ctrl.isAuthor], ctrl.deleteOne)

router.param('id', ctrl.recipeById)

    

module.exports = router;