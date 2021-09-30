const router = require('express').Router()
const ctrl = require('../controllers/auth.controller')
const validate = require('../middleware/validate')
const {check} = require('express-validator')


router.post('/', [
    check('email', 'Invalid E-mail').isEmail(),
    check('password', 'Invalid password').not().isEmpty(),
    validate
], ctrl.login)


module.exports = router