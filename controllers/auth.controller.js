const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
//const config = require('config')
require('dotenv').config({path: `.env.${process.env.NODE_ENV}`})


const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const usr = await User.findOne({email})

        if(!usr){
            return res.status(400).json({errors: [{msg: 'Invalid e-mail or password'}]})
        }

        const isMatch = await bcrypt.compare(password, usr.password);
        if(!isMatch){
            return res.status(400).json({errors: [{msg: 'Invalid e-mail or password'}]})
        }

        const payload = {
            user: {id: usr._id}
        }

        jwt.sign(payload, process.env.jwtSecret, {expiresIn: 60 * 60 * 3}, function(error, token){
            if(error) throw error;
            else return res.status(200).json(token)
        })
    } catch (err) {
        res.status(500).json({errors: [{msg: err.message}]})
    }
}




module.exports = {
    login
}