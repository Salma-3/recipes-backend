const ctrl = require('../controllers/contact.controller')
const router = require('express').Router()
const {check} = require('express-validator')
const validate = require('../middleware/validate')

router.post('/', [
    check('name', 'Invalid name').not().isEmpty(),
    check('email', 'Invalid E-mail').isEmail(),
    check('message', 'Invalid message').not().isEmpty(),
    validate
], ctrl.create)

module.exports = router;

